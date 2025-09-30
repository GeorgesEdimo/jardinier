import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
export declare class PlantsController {
    private readonly plantsService;
    constructor(plantsService: PlantsService);
    create(user: {
        userId: number;
    }, dto: CreatePlantDto): Promise<{
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
    findAll(user: {
        userId: number;
    }): Promise<({
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
    findOne(user: {
        userId: number;
    }, id: string): Promise<{
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
    update(user: {
        userId: number;
    }, id: string, dto: UpdatePlantDto): Promise<{
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
    remove(user: {
        userId: number;
    }, id: string): {
        success: Promise<boolean>;
    };
    water(user: {
        userId: number;
    }, id: string, body: {
        quantityMl?: number;
        notes?: string;
    }): Promise<{
        id: number;
        notes: string | null;
        plantId: number;
        wateredAt: Date;
        quantityMl: number | null;
    } | undefined>;
    history(user: {
        userId: number;
    }, id: string): Promise<{
        id: number;
        notes: string | null;
        plantId: number;
        wateredAt: Date;
        quantityMl: number | null;
    }[]>;
}
