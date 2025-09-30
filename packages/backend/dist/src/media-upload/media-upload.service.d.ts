import { PrismaService } from '../prisma/prisma.service';
export declare class MediaUploadService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    attachImageToPlant(plantId: number, file: any): Promise<{
        id: number;
        createdAt: Date;
        plantId: number;
        url: string;
        metadata: string | null;
    }>;
}
