import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface WeatherData {
  tempC: number;
  humidity: number;
  source: 'cache' | 'api';
  raw: any;
}

@Injectable()
export class WeatherService {
  private readonly apiKey = process.env.WEATHER_API_KEY || '';
  private readonly ttlMinutes = Number(process.env.WEATHER_TTL_MINUTES || 60);

  constructor(private readonly prisma: PrismaService) {}

  private isFresh(date: Date): boolean {
    const ageMs = Date.now() - new Date(date).getTime();
    const ttlMs = this.ttlMinutes * 60 * 1000;
    return ageMs < ttlMs;
  }

  async getWeather(city: string, country: string, force = false): Promise<WeatherData> {
    const keyCity = city.trim();
    const keyCountry = country.trim();

    if (!force) {
      const cached = await this.prisma.weatherCache.findFirst({
        where: { city: keyCity, country: keyCountry },
      });
      if (cached && this.isFresh(cached.fetchedAt)) {
        const parsed = JSON.parse(cached.data);
        return {
          tempC: parsed.tempC,
          humidity: parsed.humidity,
          source: 'cache',
          raw: parsed.raw,
        };
      }
    }

    const fresh = await this.fetchOpenWeather(keyCity, keyCountry);
    // write cache
    await this.prisma.weatherCache.upsert({
      where: { city_country: { city: keyCity, country: keyCountry } },
      update: {
        data: JSON.stringify({ tempC: fresh.tempC, humidity: fresh.humidity, raw: fresh.raw }),
        fetchedAt: new Date(),
      },
      create: {
        city: keyCity,
        country: keyCountry,
        data: JSON.stringify({ tempC: fresh.tempC, humidity: fresh.humidity, raw: fresh.raw }),
      },
    });

    return { ...fresh, source: 'api' };
  }

  private async fetchOpenWeather(city: string, country: string): Promise<Omit<WeatherData, 'source'>> {
    if (!this.apiKey) {
      // Fallback sans clé: données neutres
      return { tempC: 20, humidity: 50, raw: { note: 'WEATHER_API_KEY manquant, valeurs par défaut' } };
    }
    const q = encodeURIComponent(`${city},${country}`);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${this.apiKey}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) {
      // fallback doux si API échoue
      return { tempC: 20, humidity: 50, raw: { error: `OpenWeather status ${res.status}` } };
    }
    const data = await res.json();
    const tempC = data?.main?.temp ?? 20;
    const humidity = data?.main?.humidity ?? 50;
    return { tempC, humidity, raw: data };
  }
}
