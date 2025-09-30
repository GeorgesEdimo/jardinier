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
exports.PlantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const watering_service_1 = require("../watering/watering.service");
let PlantsService = class PlantsService {
    prisma;
    wateringService;
    constructor(prisma, wateringService) {
        this.prisma = prisma;
        this.wateringService = wateringService;
    }
    async create(userId, dto) {
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
    async findAll(userId) {
        return this.prisma.plant.findMany({
            where: { ownerId: userId },
            orderBy: { createdAt: 'desc' },
            include: { images: true, schedules: true },
        });
    }
    async findOne(userId, id) {
        return this.prisma.plant.findFirst({ where: { id, ownerId: userId } });
    }
    async update(userId, id, dto) {
        const plant = await this.findOne(userId, id);
        if (!plant)
            return undefined;
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
    async remove(userId, id) {
        const plant = await this.findOne(userId, id);
        if (!plant)
            return false;
        await this.prisma.plant.delete({ where: { id } });
        return true;
    }
    async water(userId, plantId, quantityMl, notes) {
        const plant = await this.findOne(userId, plantId);
        if (!plant)
            return undefined;
        const log = await this.prisma.waterLog.create({
            data: {
                plant: { connect: { id: plantId } },
                quantityMl: quantityMl ?? null,
                notes: notes ?? null,
            },
        });
        await this.wateringService.recomputeNextForPlant(plantId);
        return log;
    }
    async history(userId, plantId) {
        const plant = await this.findOne(userId, plantId);
        if (!plant)
            return [];
        return this.prisma.waterLog.findMany({
            where: { plantId },
            orderBy: { wateredAt: 'desc' },
        });
    }
};
exports.PlantsService = PlantsService;
exports.PlantsService = PlantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        watering_service_1.WateringService])
], PlantsService);
//# sourceMappingURL=plants.service.js.map