import { PrismaService } from '../prisma/prisma.service';
export interface WeatherData {
    tempC: number;
    humidity: number;
    source: 'cache' | 'api';
    raw: any;
}
export declare class WeatherService {
    private readonly prisma;
    private readonly apiKey;
    private readonly ttlMinutes;
    constructor(prisma: PrismaService);
    private isFresh;
    getWeather(city: string, country: string, force?: boolean): Promise<WeatherData>;
    private fetchOpenWeather;
}
