import { Module } from '@nestjs/common';
import { WateringController } from './watering.controller';
import { WateringService } from './watering.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [PrismaModule, WeatherModule],
  controllers: [WateringController],
  providers: [WateringService],
  exports: [WateringService]
})
export class WateringModule {}
