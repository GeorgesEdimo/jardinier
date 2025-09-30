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
exports.CreateScheduleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateScheduleDto {
    plantId;
    waterQuantityMl;
    frequencyDays;
    startNow;
}
exports.CreateScheduleDto = CreateScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identifiant de la plante' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateScheduleDto.prototype, "plantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Quantité d'eau en ml", minimum: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateScheduleDto.prototype, "waterQuantityMl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Fréquence d'arrosage en jours", minimum: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateScheduleDto.prototype, "frequencyDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Si true: nextWateringAt = now + frequencyDays', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduleDto.prototype, "startNow", void 0);
//# sourceMappingURL=create-schedule.dto.js.map