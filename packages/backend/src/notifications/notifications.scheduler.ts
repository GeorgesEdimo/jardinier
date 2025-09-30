import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsScheduler.name);
  private interval?: NodeJS.Timeout;

  constructor(private readonly notifications: NotificationsService) {}

  onModuleInit() {
    // Tick toutes les 15s
    this.interval = setInterval(async () => {
      try {
        const res = await this.notifications.processDueAll();
        const total = Object.values(res || {}).reduce((a, b) => a + (b || 0), 0);
        if (total > 0) {
          this.logger.log(`Rappels traités automatiquement: ${total}`);
        }
      } catch (e) {
        this.logger.warn(`Erreur scheduler notifications: ${e}`);
      }
    }, 15000);
  }

  onModuleDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
}
