import { WeatherService, WeatherData } from './weather.service';
export declare class WeatherController {
    private readonly weather;
    constructor(weather: WeatherService);
    get(city: string, country: string, force?: string): Promise<WeatherData>;
}
