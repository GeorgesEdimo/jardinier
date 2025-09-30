import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WateringService } from '../watering/watering.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wateringService: WateringService,
  ) {}

  async create(userId: number, dto: CreatePlantDto) {
    return this.prisma.plant.create({
      data: {
        name: dto.name,
        species: dto.species,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
        notes: dto.notes,
        owner: { connect: { id: userId } },
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.plant.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      include: { images: true, schedules: true },
    });
  }

  async findOne(userId: number, id: number) {
    return this.prisma.plant.findFirst({ where: { id, ownerId: userId } });
  }

  async update(userId: number, id: number, dto: UpdatePlantDto) {
    const plant = await this.findOne(userId, id);
    if (!plant) return undefined;
    return this.prisma.plant.update({
      where: { id },
      data: {
        name: dto.name,
        species: dto.species,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
        notes: dto.notes,
      },
    });
  }

  async remove(userId: number, id: number) {
    const plant = await this.findOne(userId, id);
    if (!plant) return false;
    await this.prisma.plant.delete({ where: { id } });
    return true;
  }

  async water(userId: number, plantId: number, quantityMl?: number, notes?: string) {
    // Vérifie l'existence et la propriété de la plante
    const plant = await this.findOne(userId, plantId);
    if (!plant) return undefined;
    const log = await this.prisma.waterLog.create({
      data: {
        plant: { connect: { id: plantId } },
        quantityMl: quantityMl ?? null,
        notes: notes ?? null,
      },
    });
    // Recalculer les plannings après arrosage
    await this.wateringService.recomputeNextForPlant(plantId);
    return log;
  }

  async history(userId: number, plantId: number) {
    const plant = await this.findOne(userId, plantId);
    if (!plant) return [];
    return this.prisma.waterLog.findMany({
      where: { plantId },
      orderBy: { wateredAt: 'desc' },
    });
  }
}
