import { Module } from '@nestjs/common';
import { MediaUploadController } from './media-upload.controller';
import { MediaUploadService } from './media-upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [MulterModule.register({ dest: 'uploads/' }), PrismaModule],
  controllers: [MediaUploadController],
  providers: [MediaUploadService]
})
export class MediaUploadModule {}
