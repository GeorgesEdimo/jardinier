import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService, CreateNotificationDto, UpdateNotificationDto } from './notifications.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, Min } from 'class-validator';

class CreateNotificationBodyDto implements CreateNotificationDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  plantId?: number;

  @ApiProperty({ example: 'in-app', enum: ['in-app', 'email', 'sms', 'push'] })
  @IsString()
  channel!: string;

  @ApiProperty({ required: false, example: 'Arrosage de ma plante' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ required: false, example: 'Il est temps d\'arroser votre plante !' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ required: false, example: '2025-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  sendAt?: string;

  @ApiProperty({ required: false, example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiProperty({ required: false, example: 7, description: 'Nombre de jours entre chaque rappel (si récurrent)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  recurringDays?: number;
}

class UpdateNotificationBodyDto implements UpdateNotificationDto {
  @ApiProperty({ required: false, example: 'in-app' })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  sendAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  recurringDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({ required: false, enum: ['pending', 'sent', 'failed'] })
  @IsOptional()
  @IsString()
  status?: string;
}

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un rappel' })
  create(@CurrentUser() user: { userId: number }, @Body() dto: CreateNotificationBodyDto) {
    console.log('📥 Données reçues:', JSON.stringify(dto, null, 2));
    console.log('👤 User ID:', user.userId);
    return this.notificationsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les rappels' })
  findAll(@CurrentUser() user: { userId: number }) {
    return this.notificationsService.findAll(user.userId);
  }

  @Get('active')
  @ApiOperation({ summary: 'Lister les rappels actifs' })
  findActive(@CurrentUser() user: { userId: number }) {
    return this.notificationsService.findActive(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un rappel' })
  findOne(@CurrentUser() user: { userId: number }, @Param('id') id: string) {
    return this.notificationsService.findOne(user.userId, Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un rappel' })
  update(
    @CurrentUser() user: { userId: number },
    @Param('id') id: string,
    @Body() dto: UpdateNotificationBodyDto
  ) {
    return this.notificationsService.update(user.userId, Number(id), dto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Activer/désactiver un rappel' })
  toggle(@CurrentUser() user: { userId: number }, @Param('id') id: string) {
    return this.notificationsService.toggle(user.userId, Number(id));
  }

  @Post('process')
  @ApiOperation({ summary: 'Traiter les rappels arrivés à échéance' })
  processDue(@CurrentUser() user: { userId: number }) {
    return this.notificationsService.processDue(user.userId);
  }

  @Patch(':id/mark-sent')
  @ApiOperation({ summary: 'Marquer un rappel comme envoyé' })
  markAsSent(@CurrentUser() user: { userId: number }, @Param('id') id: string) {
    return this.notificationsService.markAsSent(user.userId, Number(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un rappel' })
  remove(@CurrentUser() user: { userId: number }, @Param('id') id: string) {
    return this.notificationsService.remove(user.userId, Number(id));
  }
}
