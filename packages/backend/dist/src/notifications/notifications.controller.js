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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("./notifications.service");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateNotificationBodyDto {
    plantId;
    channel;
    subject;
    message;
    sendAt;
    isRecurring;
    recurringDays;
}
__decorate([
    (0, swagger_2.ApiProperty)({ required: false, example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNotificationBodyDto.prototype, "plantId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'in-app', enum: ['in-app', 'email', 'sms', 'push'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationBodyDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false, example: 'Arrosage de ma plante' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationBodyDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false, example: 'Il est temps d\'arroser votre plante !' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationBodyDto.prototype, "message", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false, example: '2025-01-15T10:00:00Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateNotificationBodyDto.prototype, "sendAt", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false, example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateNotificationBodyDto.prototype, "isRecurring", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false, example: 7, description: 'Nombre de jours entre chaque rappel (si récurrent)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateNotificationBodyDto.prototype, "recurringDays", void 0);
class UpdateNotificationBodyDto {
    channel;
    subject;
    message;
    sendAt;
    isRecurring;
    recurringDays;
    enabled;
    status;
}
__decorate([
    (0, swagger_2.ApiProperty)({ required: false, example: 'in-app' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNotificationBodyDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNotificationBodyDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNotificationBodyDto.prototype, "message", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], UpdateNotificationBodyDto.prototype, "sendAt", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationBodyDto.prototype, "isRecurring", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateNotificationBodyDto.prototype, "recurringDays", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationBodyDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ required: false, enum: ['pending', 'sent', 'failed'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNotificationBodyDto.prototype, "status", void 0);
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    create(user, dto) {
        console.log('📥 Données reçues:', JSON.stringify(dto, null, 2));
        console.log('👤 User ID:', user.userId);
        return this.notificationsService.create(user.userId, dto);
    }
    findAll(user) {
        return this.notificationsService.findAll(user.userId);
    }
    findActive(user) {
        return this.notificationsService.findActive(user.userId);
    }
    findOne(user, id) {
        return this.notificationsService.findOne(user.userId, Number(id));
    }
    update(user, id, dto) {
        return this.notificationsService.update(user.userId, Number(id), dto);
    }
    toggle(user, id) {
        return this.notificationsService.toggle(user.userId, Number(id));
    }
    processDue(user) {
        return this.notificationsService.processDue(user.userId);
    }
    markAsSent(user, id) {
        return this.notificationsService.markAsSent(user.userId, Number(id));
    }
    remove(user, id) {
        return this.notificationsService.remove(user.userId, Number(id));
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un rappel' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateNotificationBodyDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les rappels' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les rappels actifs' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un rappel' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un rappel' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateNotificationBodyDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Activer/désactiver un rappel' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "toggle", null);
__decorate([
    (0, common_1.Post)('process'),
    (0, swagger_1.ApiOperation)({ summary: 'Traiter les rappels arrivés à échéance' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "processDue", null);
__decorate([
    (0, common_1.Patch)(':id/mark-sent'),
    (0, swagger_1.ApiOperation)({ summary: 'Marquer un rappel comme envoyé' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsSent", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un rappel' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "remove", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map