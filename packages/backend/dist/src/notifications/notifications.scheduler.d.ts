import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
export declare class NotificationsScheduler implements OnModuleInit, OnModuleDestroy {
    private readonly notifications;
    private readonly logger;
    private interval?;
    constructor(notifications: NotificationsService);
    onModuleInit(): void;
    onModuleDestroy(): void;
}
