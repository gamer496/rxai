import { Controller, Get, Query } from '@nestjs/common';
import { PrescriptionParserService } from '../services/prescription-parser.service';
import { LoggerService } from '../../shared/services/logger.service';

@Controller('parsing-test')
export class ParsingTestController {
  constructor(
    private readonly parserService: PrescriptionParserService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('ParsingTestController');
  }

  @Get()
  async testParsing(@Query('url') url: string) {
    this.logger.log(`Testing PDF parsing with URL: ${url}`);
    const extractedText = await this.parserService.testParsing(url);
    return { text: extractedText };
  }
} 