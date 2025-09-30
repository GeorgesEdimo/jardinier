import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class WateringService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly weather: WeatherService,
  ) {}

  private addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  private async computeNextWateringAt(plantId: number, frequencyDays: number) {
    // S’il existe un dernier arrosage, repartir de celui-ci, sinon de maintenant
    const last = await this.prisma.waterLog.findFirst({
      where: { plantId },
      orderBy: { wateredAt: 'desc' },
      select: { wateredAt: true },
    });
    const base = last?.wateredAt ?? new Date();
    return this.addDays(new Date(base), frequencyDays);
  }

  async createSchedule(dto: CreateScheduleDto) {
    const plant = await this.prisma.plant.findUnique({ where: { id: dto.plantId } });
    if (!plant) throw new Error('Plant not found');
    const next = dto.startNow
      ? this.addDays(new Date(), dto.frequencyDays)
      : await this.computeNextWateringAt(dto.plantId, dto.frequencyDays);
    return this.prisma.wateringSchedule.create({
      data: {
        plant: { connect: { id: dto.plantId } },
        waterQuantityMl: dto.waterQuantityMl,
        frequencyDays: dto.frequencyDays,
        nextWateringAt: next,
      },
    });
  }

  async listSchedules(plantId?: number) {
    return this.prisma.wateringSchedule.findMany({
      where: plantId ? { plantId } : undefined,
      orderBy: { nextWateringAt: 'asc' },
    });
  }

  async updateSchedule(id: number, dto: UpdateScheduleDto) {
    // si frequencyDays change, on recalcule nextWateringAt à partir du dernier arrosage
    let nextWateringAt: Date | undefined;
    if (dto.frequencyDays) {
      const sched = await this.prisma.wateringSchedule.findUnique({ where: { id } });
      if (!sched) throw new Error('Schedule not found');
      nextWateringAt = await this.computeNextWateringAt(sched.plantId, dto.frequencyDays);
    }
    return this.prisma.wateringSchedule.update({
      where: { id },
      data: {
        waterQuantityMl: dto.waterQuantityMl,
        frequencyDays: dto.frequencyDays,
        nextWateringAt: dto.nextWateringAt ? new Date(dto.nextWateringAt) : nextWateringAt,
      },
    });
  }

  async deleteSchedule(id: number) {
    await this.prisma.wateringSchedule.delete({ where: { id } });
    return { success: true };
  }

  async listDue() {
    const now = new Date();
    return this.prisma.wateringSchedule.findMany({
      where: { nextWateringAt: { lte: now } },
      orderBy: { nextWateringAt: 'asc' },
      include: { plant: true },
    });
  }

  async recomputeNextForPlant(plantId: number) {
    // Recalcule nextWateringAt pour tous les schedules d’une plante (appelé après un arrosage)
    const schedules = await this.prisma.wateringSchedule.findMany({ where: { plantId } });
    const updates = schedules.map(async (s) => {
      const next = await this.computeNextWateringAt(plantId, s.frequencyDays);
      return this.prisma.wateringSchedule.update({
        where: { id: s.id },
        data: { nextWateringAt: next },
      });
    });
    await Promise.all(updates);
  }

  /**
   * Ajuste les frequencyDays des schedules d'une plante selon la météo
   * Règle simple:
   * - Si tempC >= 28 ou humidity <= 35% => arroser plus souvent (-1 jour min 1)
   * - Si tempC <= 10 ou humidity >= 80% => arroser moins souvent (+1 jour)
   */
  async recommendForPlant(plantId: number, city: string, country: string) {
    const meteo = await this.weather.getWeather(city, country);
    const schedules = await this.prisma.wateringSchedule.findMany({ where: { plantId } });
    const updates = schedules.map(async (s) => {
      let newFreq = s.frequencyDays;
      if (meteo.tempC >= 28 || meteo.humidity <= 35) newFreq = Math.max(1, s.frequencyDays - 1);
      if (meteo.tempC <= 10 || meteo.humidity >= 80) newFreq = s.frequencyDays + 1;
      if (newFreq !== s.frequencyDays) {
        const next = await this.computeNextWateringAt(plantId, newFreq);
        return this.prisma.wateringSchedule.update({
          where: { id: s.id },
          data: { frequencyDays: newFreq, nextWateringAt: next },
        });
      }
      return s;
    });
    const result = await Promise.all(updates);
    return { weather: { tempC: meteo.tempC, humidity: meteo.humidity, source: meteo.source }, schedules: result };
  }
}
