import { WateringService } from './watering.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
export declare class WateringController {
    private readonly wateringService;
    constructor(wateringService: WateringService);
    create(dto: CreateScheduleDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        waterQuantityMl: number;
        frequencyDays: number;
        nextWateringAt: Date | null;
        plantId: number;
    }>;
    list(plantId?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        waterQuantityMl: number;
        frequencyDays: number;
        nextWateringAt: Date | null;
        plantId: number;
    }[]>;
    update(id: string, dto: UpdateScheduleDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        waterQuantityMl: number;
        frequencyDays: number;
        nextWateringAt: Date | null;
        plantId: number;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    due(): Promise<({
        plant: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        waterQuantityMl: number;
        frequencyDays: number;
        nextWateringAt: Date | null;
        plantId: number;
    })[]>;
    recommend(plantId: string, body: {
        city: string;
        country: string;
    }): Promise<{
        weather: {
            tempC: number;
            humidity: number;
            source: "cache" | "api";
        };
        schedules: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            waterQuantityMl: number;
            frequencyDays: number;
            nextWateringAt: Date | null;
            plantId: number;
        }[];
    }>;
}
