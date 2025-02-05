import { Injectable, Logger } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';

@Injectable()
export class FileUploadService {
  private dropbox: Dropbox;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('FileUploadService');
    this.dropbox = new Dropbox({ 
      accessToken: this.configService.get<string>('DROPBOX_ACCESS_TOKEN') 
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      this.logger.debug(`Uploading file: ${file.originalname}`);
      
      const path = `/${Date.now()}_${file.originalname}`;
      await this.dropbox.filesUpload({
        path,
        contents: file.buffer,
      });

      const shareResponse = await this.dropbox.sharingCreateSharedLink({
        path,
      });

      this.logger.log(`File uploaded successfully: ${shareResponse.result.url}`);
      // Convert dropbox url to direct download url
      const directUrl = shareResponse.result.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
      return directUrl;
    } catch (error) {
      this.logger.error('Failed to upload file', error.stack);
      throw new Error('Failed to upload file to Dropbox');
    }
  }
} 