import { NotificationsService, CreateNotificationDto, UpdateNotificationDto } from './notifications.service';
declare class CreateNotificationBodyDto implements CreateNotificationDto {
    plantId?: number;
    channel: string;
    subject?: string;
    message?: string;
    sendAt?: string;
    isRecurring?: boolean;
    recurringDays?: number;
}
declare class UpdateNotificationBodyDto implements UpdateNotificationDto {
    channel?: string;
    subject?: string;
    message?: string;
    sendAt?: Date;
    isRecurring?: boolean;
    recurringDays?: number;
    enabled?: boolean;
    status?: string;
}
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(user: {
        userId: number;
    }, dto: CreateNotificationBodyDto): Promise<{
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
    findAll(user: {
        userId: number;
    }): Promise<({
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
    findActive(user: {
        userId: number;
    }): Promise<({
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
    findOne(user: {
        userId: number;
    }, id: string): Promise<{
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
    update(user: {
        userId: number;
    }, id: string, dto: UpdateNotificationBodyDto): Promise<{
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
    toggle(user: {
        userId: number;
    }, id: string): Promise<{
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
    processDue(user: {
        userId: number;
    }): Promise<any[]>;
    markAsSent(user: {
        userId: number;
    }, id: string): Promise<{
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
    remove(user: {
        userId: number;
    }, id: string): Promise<{
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
export {};
