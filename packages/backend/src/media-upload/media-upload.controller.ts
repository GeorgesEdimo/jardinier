import { Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaUploadService } from './media-upload.service';

@Controller('media-upload')
export class MediaUploadController {
  constructor(private readonly mediaService: MediaUploadService) {}

  // Champ de formulaire attendu: "file"
  @Post(':plantId')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Param('plantId') plantId: string, @UploadedFile() file: any) {
    return this.mediaService.attachImageToPlant(Number(plantId), file);
  }
}
