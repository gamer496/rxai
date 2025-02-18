import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './services/logger.service';
import { FileUploadService } from './services/file-upload.service';
import { FileUploadController } from './controllers/file-upload.controller';
import { TestController } from './controllers/test.controller';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [LoggerService, FileUploadService],
  exports: [LoggerService, FileUploadService],
  controllers: [FileUploadController, TestController],
})
export class SharedModule {} 