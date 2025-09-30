"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WeatherService = class WeatherService {
    prisma;
    apiKey = process.env.WEATHER_API_KEY || '';
    ttlMinutes = Number(process.env.WEATHER_TTL_MINUTES || 60);
    constructor(prisma) {
        this.prisma = prisma;
    }
    isFresh(date) {
        const ageMs = Date.now() - new Date(date).getTime();
        const ttlMs = this.ttlMinutes * 60 * 1000;
        return ageMs < ttlMs;
    }
    async getWeather(city, country, force = false) {
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
    async fetchOpenWeather(city, country) {
        if (!this.apiKey) {
            return { tempC: 20, humidity: 50, raw: { note: 'WEATHER_API_KEY manquant, valeurs par défaut' } };
        }
        const q = encodeURIComponent(`${city},${country}`);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${this.apiKey}&units=metric`;
        const res = await fetch(url);
        if (!res.ok) {
            return { tempC: 20, humidity: 50, raw: { error: `OpenWeather status ${res.status}` } };
        }
        const data = await res.json();
        const tempC = data?.main?.temp ?? 20;
        const humidity = data?.main?.humidity ?? 50;
        return { tempC, humidity, raw: data };
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WeatherService);
//# sourceMappingURL=weather.service.js.map