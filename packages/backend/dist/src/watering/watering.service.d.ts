import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { WeatherService } from '../weather/weather.service';
export declare class WateringService {
    private readonly prisma;
    private readonly weather;
    constructor(prisma: PrismaService, weather: WeatherService);
    private addDays;
    private computeNextWateringAt;
    createSchedule(dto: CreateScheduleDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        waterQuantityMl: number;
        frequencyDays: number;
        nextWateringAt: Date | null;
        plantId: number;
    }>;
    listSchedules(plantId?: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        waterQuantityMl: number;
        frequencyDays: number;
        nextWateringAt: Date | null;
        plantId: number;
    }[]>;
    updateSchedule(id: number, dto: UpdateScheduleDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        waterQuantityMl: number;
        frequencyDays: number;
        nextWateringAt: Date | null;
        plantId: number;
    }>;
    deleteSchedule(id: number): Promise<{
        success: boolean;
    }>;
    listDue(): Promise<({
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
    recomputeNextForPlant(plantId: number): Promise<void>;
    recommendForPlant(plantId: number, city: string, country: string): Promise<{
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
