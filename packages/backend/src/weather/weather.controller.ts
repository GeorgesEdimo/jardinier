import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WeatherService, WeatherData } from './weather.service';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weather: WeatherService) {}

  @Get(':city/:country')
  @ApiOperation({ summary: 'Obtenir la météo (avec cache) pour une ville/pays' })
  get(
    @Param('city') city: string,
    @Param('country') country: string,
    @Query('force') force?: string,
  ): Promise<WeatherData> {
    return this.weather.getWeather(city, country, force === 'true');
  }
}
