import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateNotificationDto {
  plantId?: number;
  channel: string;
  subject?: string;
  message?: string;
  sendAt?: string | Date;
  isRecurring?: boolean;
  recurringDays?: number;
}

export interface UpdateNotificationDto {
  channel?: string;
  subject?: string;
  message?: string;
  sendAt?: Date;
  isRecurring?: boolean;
  recurringDays?: number;
  enabled?: boolean;
  status?: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Créer un rappel pour un utilisateur
   */
  async create(userId: number, dto: CreateNotificationDto) {
    const sendAt = dto.sendAt ? new Date(dto.sendAt) : new Date();
    return this.prisma.notification.create({
      data: {
        userId,
        plantId: dto.plantId,
        channel: dto.channel,
        subject: dto.subject,
        message: dto.message,
        sendAt,
        isRecurring: dto.isRecurring ?? false,
        recurringDays: dto.recurringDays,
      },
      include: {
        plant: {
          select: { id: true, name: true, species: true }
        }
      }
    });
  }

  /**
   * Traiter les rappels arrivés à échéance maintenant (<= now)
   */
  async processDue(userId: number) {
    const now = new Date();
    const due = await this.prisma.notification.findMany({
      where: {
        userId,
        enabled: true,
        status: 'pending',
        sendAt: { lte: now },
      },
      include: { plant: { select: { id: true, name: true, species: true } } },
      orderBy: { sendAt: 'asc' },
    });

    const processed: any[] = [];
    for (const n of due) {
      try {
        if (n.channel !== 'in-app') {
          // eslint-disable-next-line no-console
          console.log(`[SEND:${n.channel}]`, n.subject || 'Rappel', '=>', n.message);
        }
        if (n.isRecurring && n.recurringDays && n.sendAt) {
          const next = new Date(n.sendAt);
          next.setDate(next.getDate() + n.recurringDays);
          await this.prisma.notification.update({ where: { id: n.id }, data: { status: 'sent', sendAt: next } });
        } else {
          await this.prisma.notification.update({ where: { id: n.id }, data: { status: 'sent', enabled: false } });
        }
        processed.push(n);
      } catch (err) {
        await this.prisma.notification.update({ where: { id: n.id }, data: { status: 'failed' } });
      }
    }
    return processed;
  }

  /**
   * Traiter les rappels échus pour tous les utilisateurs ayant des notifications dues
   */
  async processDueAll() {
    const now = new Date();
    // Récupérer les userIds ayant au moins un rappel dû
    const due = await this.prisma.notification.findMany({
      where: { enabled: true, status: 'pending', sendAt: { lte: now } },
      select: { userId: true },
      distinct: ['userId'] as any,
    });
    const results: Record<number, number> = {};
    for (const row of due) {
      const userId = row.userId;
      const processed = await this.processDue(userId);
      results[userId] = processed.length;
    }
    return results;
  }

  /**
   * Lister tous les rappels d'un utilisateur
   */
  async findAll(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      include: { plant: { select: { id: true, name: true, species: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lister les rappels actifs d'un utilisateur
   */
  async findActive(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId, enabled: true, status: 'pending' },
      include: { plant: { select: { id: true, name: true, species: true } } },
      orderBy: { sendAt: 'asc' },
    });
  }

  /**
   * Récupérer un rappel spécifique
   */
  async findOne(userId: number, id: number) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
      include: { plant: { select: { id: true, name: true, species: true } } },
    });
    if (!notification) throw new Error('Rappel introuvable');
    return notification;
  }

  /**
   * Mettre à jour un rappel
   */
  async update(userId: number, id: number, dto: UpdateNotificationDto) {
    await this.findOne(userId, id);
    return this.prisma.notification.update({
      where: { id },
      data: {
        channel: dto.channel,
        subject: dto.subject,
        message: dto.message,
        sendAt: dto.sendAt,
        isRecurring: dto.isRecurring,
        recurringDays: dto.recurringDays,
        enabled: dto.enabled,
        status: dto.status,
      },
      include: { plant: { select: { id: true, name: true, species: true } } },
    });
  }

  /**
   * Supprimer un rappel
   */
  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    return this.prisma.notification.delete({ where: { id } });
  }

  /**
   * Activer/désactiver un rappel
   */
  async toggle(userId: number, id: number) {
    const notification = await this.findOne(userId, id);
    return this.update(userId, id, { enabled: !notification.enabled });
  }

  /**
   * Marquer un rappel comme envoyé
   */
  async markAsSent(userId: number, id: number) {
    const notification = await this.findOne(userId, id);
    if (notification.isRecurring && notification.recurringDays && notification.sendAt) {
      const nextSendAt = new Date(notification.sendAt);
      nextSendAt.setDate(nextSendAt.getDate() + notification.recurringDays);
      await this.update(userId, id, { status: 'sent', sendAt: nextSendAt });
    } else {
      await this.update(userId, id, { status: 'sent' });
    }
    return this.findOne(userId, id);
  }

  /**
   * Créer un rappel automatique pour un arrosage dû
   */
  async createWateringReminder(userId: number, plantId: number, nextWateringAt: Date, frequencyDays: number) {
    const plant = await this.prisma.plant.findUnique({ where: { id: plantId }, select: { name: true } });
    return this.create(userId, {
      plantId,
      channel: 'in-app',
      subject: `Arrosage de ${plant?.name || 'votre plante'}`,
      message: `Il est temps d'arroser ${plant?.name || 'votre plante'} !`,
      sendAt: nextWateringAt,
      isRecurring: true,
      recurringDays: frequencyDays,
    });
  }
}
