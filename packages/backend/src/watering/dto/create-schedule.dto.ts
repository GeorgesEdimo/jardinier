import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ description: 'Identifiant de la plante' })
  @IsInt()
  plantId!: number;

  @ApiProperty({ description: "Quantité d'eau en ml", minimum: 1 })
  @IsInt()
  @Min(1)
  waterQuantityMl!: number;

  @ApiProperty({ description: "Fréquence d'arrosage en jours", minimum: 1 })
  @IsInt()
  @Min(1)
  frequencyDays!: number;

  @ApiProperty({ description: 'Si true: nextWateringAt = now + frequencyDays', required: false })
  @IsOptional()
  @IsBoolean()
  startNow?: boolean;
}
