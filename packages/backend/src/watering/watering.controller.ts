import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { WateringService } from './watering.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('watering')
@Controller('watering')
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}

  // Créer un planning d’arrosage
  @Post('schedules')
  @ApiOperation({ summary: 'Créer un planning' })
  create(@Body() dto: CreateScheduleDto) {
    return this.wateringService.createSchedule(dto);
  }

  // Lister les plannings (optionnellement filtrés par plantId)
  @Get('schedules')
  @ApiOperation({ summary: 'Lister les plannings' })
  list(@Query('plantId') plantId?: string) {
    return this.wateringService.listSchedules(plantId ? Number(plantId) : undefined);
  }

  // Mettre à jour un planning
  @Patch('schedules/:id')
  @ApiOperation({ summary: 'Mettre à jour un planning' })
  update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.wateringService.updateSchedule(Number(id), dto);
  }

  // Supprimer un planning
  @Delete('schedules/:id')
  @ApiOperation({ summary: 'Supprimer un planning' })
  remove(@Param('id') id: string) {
    return this.wateringService.deleteSchedule(Number(id));
  }

  // Lister les arrosages dus (nextWateringAt <= now)
  @Get('due')
  @ApiOperation({ summary: 'Lister les arrosages dus' })
  due() {
    return this.wateringService.listDue();
  }

  // Recommander des ajustements de fréquence à partir de la météo et mettre à jour les schedules
  @Post('recommend/:plantId')
  @ApiOperation({ summary: 'Ajuster les fréquences selon la météo et recalculer nextWateringAt' })
  recommend(
    @Param('plantId') plantId: string,
    @Body() body: { city: string; country: string }
  ) {
    return this.wateringService.recommendForPlant(Number(plantId), body.city, body.country);
  }
}
