import { PrismaService } from '../prisma/prisma.service';
import { WateringService } from '../watering/watering.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
export declare class PlantsService {
    private readonly prisma;
    private readonly wateringService;
    constructor(prisma: PrismaService, wateringService: WateringService);
    create(userId: number, dto: CreatePlantDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
        species: string | null;
        purchaseDate: Date | null;
        notes: string | null;
        locationCity: string | null;
        locationCountry: string | null;
    }>;
    findAll(userId: number): Promise<({
        images: {
            id: number;
            createdAt: Date;
            plantId: number;
            url: string;
            metadata: string | null;
        }[];
        schedules: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            waterQuantityMl: number;
            frequencyDays: number;
            nextWateringAt: Date | null;
            plantId: number;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
        species: string | null;
        purchaseDate: Date | null;
        notes: string | null;
        locationCity: string | null;
        locationCountry: string | null;
    })[]>;
    findOne(userId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
        species: string | null;
        purchaseDate: Date | null;
        notes: string | null;
        locationCity: string | null;
        locationCountry: string | null;
    } | null>;
    update(userId: number, id: number, dto: UpdatePlantDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
        species: string | null;
        purchaseDate: Date | null;
        notes: string | null;
        locationCity: string | null;
        locationCountry: string | null;
    } | undefined>;
    remove(userId: number, id: number): Promise<boolean>;
    water(userId: number, plantId: number, quantityMl?: number, notes?: string): Promise<{
        id: number;
        notes: string | null;
        plantId: number;
        wateredAt: Date;
        quantityMl: number | null;
    } | undefined>;
    history(userId: number, plantId: number): Promise<{
        id: number;
        notes: string | null;
        plantId: number;
        wateredAt: Date;
        quantityMl: number | null;
    }[]>;
}
