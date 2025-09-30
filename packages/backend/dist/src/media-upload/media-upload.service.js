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
exports.MediaUploadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MediaUploadService = class MediaUploadService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async attachImageToPlant(plantId, file) {
        const plant = await this.prisma.plant.findUnique({ where: { id: plantId } });
        if (!plant)
            throw new Error('Plant not found');
        const url = `/uploads/${file.filename}`;
        const metadata = JSON.stringify({ originalname: file.originalname, mimetype: file.mimetype, size: file.size });
        return this.prisma.image.create({
            data: {
                plant: { connect: { id: plantId } },
                url,
                metadata,
            },
        });
    }
};
exports.MediaUploadService = MediaUploadService;
exports.MediaUploadService = MediaUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaUploadService);
//# sourceMappingURL=media-upload.service.js.map