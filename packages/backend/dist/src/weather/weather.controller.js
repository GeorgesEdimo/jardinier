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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const weather_service_1 = require("./weather.service");
let WeatherController = class WeatherController {
    weather;
    constructor(weather) {
        this.weather = weather;
    }
    get(city, country, force) {
        return this.weather.getWeather(city, country, force === 'true');
    }
};
exports.WeatherController = WeatherController;
__decorate([
    (0, common_1.Get)(':city/:country'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir la météo (avec cache) pour une ville/pays' }),
    __param(0, (0, common_1.Param)('city')),
    __param(1, (0, common_1.Param)('country')),
    __param(2, (0, common_1.Query)('force')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "get", null);
exports.WeatherController = WeatherController = __decorate([
    (0, swagger_1.ApiTags)('weather'),
    (0, common_1.Controller)('weather'),
    __metadata("design:paramtypes", [weather_service_1.WeatherService])
], WeatherController);
//# sourceMappingURL=weather.controller.js.map