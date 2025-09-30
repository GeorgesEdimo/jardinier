import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateScheduleDto {
  @ApiPropertyOptional({ description: "Quantité d'eau en ml", minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  waterQuantityMl?: number;

  @ApiPropertyOptional({ description: "Fréquence d'arrosage en jours", minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  frequencyDays?: number;

  @ApiPropertyOptional({ description: 'Date ISO pour forcer le prochain arrosage' })
  @IsOptional()
  @IsISO8601()
  nextWateringAt?: string;
}
