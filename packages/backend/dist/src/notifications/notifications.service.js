"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
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
    async processDue(userId) {
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
        const processed = [];
        for (const n of due) {
            try {
                if (n.channel !== 'in-app') {
                    console.log(`[SEND:${n.channel}]`, n.subject || 'Rappel', '=>', n.message);
                }
                if (n.isRecurring && n.recurringDays && n.sendAt) {
                    const next = new Date(n.sendAt);
                    next.setDate(next.getDate() + n.recurringDays);
                    await this.prisma.notification.update({ where: { id: n.id }, data: { status: 'sent', sendAt: next } });
                }
                else {
                    await this.prisma.notification.update({ where: { id: n.id }, data: { status: 'sent', enabled: false } });
                }
                processed.push(n);
            }
            catch (err) {
                await this.prisma.notification.update({ where: { id: n.id }, data: { status: 'failed' } });
            }
        }
        return processed;
    }
    async processDueAll() {
        const now = new Date();
        const due = await this.prisma.notification.findMany({
            where: { enabled: true, status: 'pending', sendAt: { lte: now } },
            select: { userId: true },
            distinct: ['userId'],
        });
        const results = {};
        for (const row of due) {
            const userId = row.userId;
            const processed = await this.processDue(userId);
            results[userId] = processed.length;
        }
        return results;
    }
    async findAll(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            include: { plant: { select: { id: true, name: true, species: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findActive(userId) {
        return this.prisma.notification.findMany({
            where: { userId, enabled: true, status: 'pending' },
            include: { plant: { select: { id: true, name: true, species: true } } },
            orderBy: { sendAt: 'asc' },
        });
    }
    async findOne(userId, id) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId },
            include: { plant: { select: { id: true, name: true, species: true } } },
        });
        if (!notification)
            throw new Error('Rappel introuvable');
        return notification;
    }
    async update(userId, id, dto) {
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
    async remove(userId, id) {
        await this.findOne(userId, id);
        return this.prisma.notification.delete({ where: { id } });
    }
    async toggle(userId, id) {
        const notification = await this.findOne(userId, id);
        return this.update(userId, id, { enabled: !notification.enabled });
    }
    async markAsSent(userId, id) {
        const notification = await this.findOne(userId, id);
        if (notification.isRecurring && notification.recurringDays && notification.sendAt) {
            const nextSendAt = new Date(notification.sendAt);
            nextSendAt.setDate(nextSendAt.getDate() + notification.recurringDays);
            await this.update(userId, id, { status: 'sent', sendAt: nextSendAt });
        }
        else {
            await this.update(userId, id, { status: 'sent' });
        }
        return this.findOne(userId, id);
    }
    async createWateringReminder(userId, plantId, nextWateringAt, frequencyDays) {
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
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map