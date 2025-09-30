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
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: number, dto: CreateNotificationDto): Promise<{
        plant: {
            id: number;
            name: string;
            species: string | null;
        } | null;
    } & {
        channel: string;
        subject: string | null;
        message: string | null;
        status: string;
        sendAt: Date | null;
        isRecurring: boolean;
        recurringDays: number | null;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        plantId: number | null;
    }>;
    processDue(userId: number): Promise<any[]>;
    processDueAll(): Promise<Record<number, number>>;
    findAll(userId: number): Promise<({
        plant: {
            id: number;
            name: string;
            species: string | null;
        } | null;
    } & {
        channel: string;
        subject: string | null;
        message: string | null;
        status: string;
        sendAt: Date | null;
        isRecurring: boolean;
        recurringDays: number | null;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        plantId: number | null;
    })[]>;
    findActive(userId: number): Promise<({
        plant: {
            id: number;
            name: string;
            species: string | null;
        } | null;
    } & {
        channel: string;
        subject: string | null;
        message: string | null;
        status: string;
        sendAt: Date | null;
        isRecurring: boolean;
        recurringDays: number | null;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        plantId: number | null;
    })[]>;
    findOne(userId: number, id: number): Promise<{
        plant: {
            id: number;
            name: string;
            species: string | null;
        } | null;
    } & {
        channel: string;
        subject: string | null;
        message: string | null;
        status: string;
        sendAt: Date | null;
        isRecurring: boolean;
        recurringDays: number | null;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        plantId: number | null;
    }>;
    update(userId: number, id: number, dto: UpdateNotificationDto): Promise<{
        plant: {
            id: number;
            name: string;
            species: string | null;
        } | null;
    } & {
        channel: string;
        subject: string | null;
        message: string | null;
        status: string;
        sendAt: Date | null;
        isRecurring: boolean;
        recurringDays: number | null;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        plantId: number | null;
    }>;
    remove(userId: number, id: number): Promise<{
        channel: string;
        subject: string | null;
        message: string | null;
        status: string;
        sendAt: Date | null;
        isRecurring: boolean;
        recurringDays: number | null;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        plantId: number | null;
    }>;
    toggle(userId: number, id: number): Promise<{
        plant: {
            id: number;
            name: string;
            species: string | null;
        } | null;
    } & {
        channel: string;
        subject: string | null;
        message: string | null;
        status: string;
        sendAt: Date | null;
        isRecurring: boolean;
        recurringDays: number | null;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        plantId: number | null;
    }>;
    markAsSent(userId: number, id: number): Promise<{
        plant: {
            id: number;
            name: string;
            species: string | null;
        } | null;
    } & {
        channel: string;
        subject: string | null;
        message: string | null;
        status: string;
        sendAt: Date | null;
        isRecurring: boolean;
        recurringDays: number | null;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        plantId: number | null;
    }>;
    createWateringReminder(userId: number, plantId: number, nextWateringAt: Date, frequencyDays: number): Promise<{
        plant: {
            id: number;
            name: string;
            species: string | null;
        } | null;
    } & {
        channel: string;
        subject: string | null;
        message: string | null;
        status: string;
        sendAt: Date | null;
        isRecurring: boolean;
        recurringDays: number | null;
        enabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        plantId: number | null;
    }>;
}
