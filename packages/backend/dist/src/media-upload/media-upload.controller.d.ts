import { MediaUploadService } from './media-upload.service';
export declare class MediaUploadController {
    private readonly mediaService;
    constructor(mediaService: MediaUploadService);
    upload(plantId: string, file: any): Promise<{
        id: number;
        createdAt: Date;
        plantId: number;
        url: string;
        metadata: string | null;
    }>;
}
