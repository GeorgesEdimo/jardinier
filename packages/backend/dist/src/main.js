"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const fs_1 = require("fs");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const uploadsPath = (0, path_1.join)(process.cwd(), 'uploads');
    if (!(0, fs_1.existsSync)(uploadsPath)) {
        (0, fs_1.mkdirSync)(uploadsPath, { recursive: true });
    }
    app.useStaticAssets(uploadsPath, { prefix: '/uploads/' });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Jardinier API')
        .setDescription("API de gestion des plantes d'intérieur: plantes, arrosage, notifications")
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 Backend démarré sur http://localhost:${port}`);
    console.log(`📚 Swagger disponible sur http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map