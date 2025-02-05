import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { LoggerService } from '../../shared/services/logger.service';

export interface ParsedPrescription {
  customerName: string;
  doctorName: string;
  date: Date;
  medicineName: string;
  confidence: number;
}

@Injectable()
export class PrescriptionParserService {
  private visionClient: ImageAnnotatorClient;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService
  ) {
    this.visionClient = new ImageAnnotatorClient({
      keyFilename: configService.get<string>('google.credentials'),
    });
    this.logger.setContext('PrescriptionParserService');
  }

  async parse(imageUrl: string): Promise<ParsedPrescription> {
    this.logger.log(`Starting prescription parsing for image: ${imageUrl}`);
    const extractedText = await this.extractTextFromImage(imageUrl);
    const parsedData = await this.parseTextWithAI(extractedText);
    return parsedData;
  }

  private async extractTextFromImage(imageUrl: string): Promise<string> {
    try {
      this.logger.debug('Extracting text from image using Google Vision API');
      const [result] = await this.visionClient.textDetection(imageUrl);
      const detections = result.textAnnotations;
      this.logger.debug("detections detected", JSON.stringify(detections));
      const text = detections?.[0]?.description || '';
      this.logger.debug(`Text extraction completed. Characters extracted: ${text.length}`);
      return text;
    } catch (error) {
      this.logger.error('Failed to extract text from image', error.stack);
      throw new Error('Failed to extract text from image');
    }
  }

  private async parseTextWithAI(text: string): Promise<ParsedPrescription> {
    this.logger.debug('Parsing extracted text with AI');
    // Temporary mock implementation until OpenAI integration
    return {
      customerName: 'Extracted Customer Name',
      doctorName: 'Extracted Doctor Name',
      date: new Date(),
      medicineName: 'Extracted Medicine Name',
      confidence: 0.95,
    };
  }
} 