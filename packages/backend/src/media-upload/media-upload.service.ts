import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaUploadService {
  constructor(private readonly prisma: PrismaService) {}

  async attachImageToPlant(plantId: number, file: any) {
    const plant = await this.prisma.plant.findUnique({ where: { id: plantId } });
    if (!plant) throw new Error('Plant not found');

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
}
