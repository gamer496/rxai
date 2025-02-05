import { Controller, Get, Query } from '@nestjs/common';
import { PrescriptionParserService } from '../services/prescription-parser.service';
import { LoggerService } from '../../shared/services/logger.service';

@Controller('vision-test')
export class VisionTestController {
  constructor(
    private readonly parserService: PrescriptionParserService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('VisionTestController');
  }

  @Get()
  async testVision(@Query('url') url: string) {
    this.logger.log(`Testing PDF parsing with URL: ${url}`);
    const extractedText = await this.parserService.testVision(url);
    return { text: extractedText };
  }
} 