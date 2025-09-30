import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('plants')
@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une plante' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  create(@CurrentUser() user: { userId: number }, @Body() dto: CreatePlantDto) {
    return this.plantsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les plantes' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findAll(@CurrentUser() user: { userId: number }) {
    return this.plantsService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une plante par id' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findOne(@CurrentUser() user: { userId: number }, @Param('id') id: string) {
    const plant = this.plantsService.findOne(user.userId, Number(id));
    return plant ?? { error: 'Not found' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une plante' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  update(@CurrentUser() user: { userId: number }, @Param('id') id: string, @Body() dto: UpdatePlantDto) {
    const updated = this.plantsService.update(user.userId, Number(id), dto);
    return updated ?? { error: 'Not found' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une plante' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  remove(@CurrentUser() user: { userId: number }, @Param('id') id: string) {
    const ok = this.plantsService.remove(user.userId, Number(id));
    return { success: ok };
  }

  @Post(':id/water')
  @ApiOperation({ summary: 'Marquer un arrosage pour une plante' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  water(
    @CurrentUser() user: { userId: number },
    @Param('id') id: string,
    @Body() body: { quantityMl?: number; notes?: string }
  ) {
    const watered = this.plantsService.water(user.userId, Number(id), body?.quantityMl, body?.notes);
    return watered ?? { error: 'Not found' };
  }

  @Get(':id/history')
  @ApiOperation({ summary: "Historique d'arrosage d'une plante" })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  history(@CurrentUser() user: { userId: number }, @Param('id') id: string) {
    return this.plantsService.history(user.userId, Number(id));
  }
}
