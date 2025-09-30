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
exports.WateringService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const weather_service_1 = require("../weather/weather.service");
let WateringService = class WateringService {
    prisma;
    weather;
    constructor(prisma, weather) {
        this.prisma = prisma;
        this.weather = weather;
    }
    addDays(date, days) {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }
    async computeNextWateringAt(plantId, frequencyDays) {
        const last = await this.prisma.waterLog.findFirst({
            where: { plantId },
            orderBy: { wateredAt: 'desc' },
            select: { wateredAt: true },
        });
        const base = last?.wateredAt ?? new Date();
        return this.addDays(new Date(base), frequencyDays);
    }
    async createSchedule(dto) {
        const plant = await this.prisma.plant.findUnique({ where: { id: dto.plantId } });
        if (!plant)
            throw new Error('Plant not found');
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
    async listSchedules(plantId) {
        return this.prisma.wateringSchedule.findMany({
            where: plantId ? { plantId } : undefined,
            orderBy: { nextWateringAt: 'asc' },
        });
    }
    async updateSchedule(id, dto) {
        let nextWateringAt;
        if (dto.frequencyDays) {
            const sched = await this.prisma.wateringSchedule.findUnique({ where: { id } });
            if (!sched)
                throw new Error('Schedule not found');
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
    async deleteSchedule(id) {
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
    async recomputeNextForPlant(plantId) {
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
    async recommendForPlant(plantId, city, country) {
        const meteo = await this.weather.getWeather(city, country);
        const schedules = await this.prisma.wateringSchedule.findMany({ where: { plantId } });
        const updates = schedules.map(async (s) => {
            let newFreq = s.frequencyDays;
            if (meteo.tempC >= 28 || meteo.humidity <= 35)
                newFreq = Math.max(1, s.frequencyDays - 1);
            if (meteo.tempC <= 10 || meteo.humidity >= 80)
                newFreq = s.frequencyDays + 1;
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
};
exports.WateringService = WateringService;
exports.WateringService = WateringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        weather_service_1.WeatherService])
], WateringService);
//# sourceMappingURL=watering.service.js.map