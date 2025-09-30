import { Module } from '@nestjs/common';
import { PlantsController } from './plants.controller';
import { PlantsService } from './plants.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WateringModule } from '../watering/watering.module';

@Module({
  imports: [PrismaModule, WateringModule],
  controllers: [PlantsController],
  providers: [PlantsService]
})
export class PlantsModule {}
