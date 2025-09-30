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
exports.PlantsController = void 0;
const common_1 = require("@nestjs/common");
const plants_service_1 = require("./plants.service");
const create_plant_dto_1 = require("./dto/create-plant.dto");
const update_plant_dto_1 = require("./dto/update-plant.dto");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let PlantsController = class PlantsController {
    plantsService;
    constructor(plantsService) {
        this.plantsService = plantsService;
    }
    create(user, dto) {
        return this.plantsService.create(user.userId, dto);
    }
    findAll(user) {
        return this.plantsService.findAll(user.userId);
    }
    findOne(user, id) {
        const plant = this.plantsService.findOne(user.userId, Number(id));
        return plant ?? { error: 'Not found' };
    }
    update(user, id, dto) {
        const updated = this.plantsService.update(user.userId, Number(id), dto);
        return updated ?? { error: 'Not found' };
    }
    remove(user, id) {
        const ok = this.plantsService.remove(user.userId, Number(id));
        return { success: ok };
    }
    water(user, id, body) {
        const watered = this.plantsService.water(user.userId, Number(id), body?.quantityMl, body?.notes);
        return watered ?? { error: 'Not found' };
    }
    history(user, id) {
        return this.plantsService.history(user.userId, Number(id));
    }
};
exports.PlantsController = PlantsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une plante' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_plant_dto_1.CreatePlantDto]),
    __metadata("design:returntype", void 0)
], PlantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les plantes' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir une plante par id' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PlantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une plante' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_plant_dto_1.UpdatePlantDto]),
    __metadata("design:returntype", void 0)
], PlantsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une plante' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PlantsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/water'),
    (0, swagger_1.ApiOperation)({ summary: 'Marquer un arrosage pour une plante' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], PlantsController.prototype, "water", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    (0, swagger_1.ApiOperation)({ summary: "Historique d'arrosage d'une plante" }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PlantsController.prototype, "history", null);
exports.PlantsController = PlantsController = __decorate([
    (0, swagger_1.ApiTags)('plants'),
    (0, common_1.Controller)('plants'),
    __metadata("design:paramtypes", [plants_service_1.PlantsService])
], PlantsController);
//# sourceMappingURL=plants.controller.js.map