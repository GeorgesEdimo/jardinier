import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreatePlantDto {
  @ApiProperty({ description: 'Nom de la plante' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Espèce de la plante' })
  @IsOptional()
  @IsString()
  species?: string;

  @ApiPropertyOptional({ description: 'Date d\'achat (ISO8601)' })
  @IsOptional()
  @IsISO8601()
  purchaseDate?: string;

  @ApiPropertyOptional({ description: 'Notes libres' })
  @IsOptional()
  @IsString()
  notes?: string;
}
