import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlantsModule } from './plants/plants.module';
import { WateringModule } from './watering/watering.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WeatherModule } from './weather/weather.module';
import { AiModule } from './ai/ai.module';
import { MediaUploadModule } from './media-upload/media-upload.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, AuthModule, PlantsModule, WateringModule, NotificationsModule, WeatherModule, AiModule, MediaUploadModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
