import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../services/file-upload.service';
import { LoggerService } from '../services/logger.service';

@Controller('upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('FileUploadController');
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.logger.log(`Received file upload request: ${file.originalname}`);
    const url = await this.fileUploadService.uploadFile(file);
    return { url };
  }
} 