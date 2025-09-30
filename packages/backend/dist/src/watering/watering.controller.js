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
exports.WateringController = void 0;
const common_1 = require("@nestjs/common");
const watering_service_1 = require("./watering.service");
const create_schedule_dto_1 = require("./dto/create-schedule.dto");
const update_schedule_dto_1 = require("./dto/update-schedule.dto");
const swagger_1 = require("@nestjs/swagger");
let WateringController = class WateringController {
    wateringService;
    constructor(wateringService) {
        this.wateringService = wateringService;
    }
    create(dto) {
        return this.wateringService.createSchedule(dto);
    }
    list(plantId) {
        return this.wateringService.listSchedules(plantId ? Number(plantId) : undefined);
    }
    update(id, dto) {
        return this.wateringService.updateSchedule(Number(id), dto);
    }
    remove(id) {
        return this.wateringService.deleteSchedule(Number(id));
    }
    due() {
        return this.wateringService.listDue();
    }
    recommend(plantId, body) {
        return this.wateringService.recommendForPlant(Number(plantId), body.city, body.country);
    }
};
exports.WateringController = WateringController;
__decorate([
    (0, common_1.Post)('schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un planning' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", void 0)
], WateringController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les plannings' }),
    __param(0, (0, common_1.Query)('plantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WateringController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)('schedules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un planning' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_schedule_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", void 0)
], WateringController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('schedules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un planning' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WateringController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('due'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les arrosages dus' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WateringController.prototype, "due", null);
__decorate([
    (0, common_1.Post)('recommend/:plantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajuster les fréquences selon la météo et recalculer nextWateringAt' }),
    __param(0, (0, common_1.Param)('plantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WateringController.prototype, "recommend", null);
exports.WateringController = WateringController = __decorate([
    (0, swagger_1.ApiTags)('watering'),
    (0, common_1.Controller)('watering'),
    __metadata("design:paramtypes", [watering_service_1.WateringService])
], WateringController);
//# sourceMappingURL=watering.controller.js.map