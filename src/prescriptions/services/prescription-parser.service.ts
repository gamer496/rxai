import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../shared/services/logger.service';
import * as pdfParse from 'pdf-parse';
import axios from 'axios';
import OpenAI from 'openai';

export interface ParsedPrescription {
  customerName: string;
  doctorName: string;
  date: Date;
  medicineName: string;
  confidence: number;
}

@Injectable()
export class PrescriptionParserService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService
  ) {
    this.logger.setContext('PrescriptionParserService');
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('openai.apiKey'),
    });
  }

  async testParsing(pdfUrl: string): Promise<string> {
    const extractedText = await this.parse(pdfUrl);
    return JSON.stringify(extractedText);
  }

  async parse(pdfUrl: string): Promise<ParsedPrescription> {
    this.logger.log(`Starting prescription parsing for PDF: ${pdfUrl}`);
    const extractedText = await this.extractTextFromPdf(pdfUrl);
    const parsedData = await this.parseTextWithAI(extractedText);
    return parsedData;
  }

  private async extractTextFromPdf(pdfUrl: string): Promise<string> {
    try {
      this.logger.debug('Downloading PDF file');
      const response = await axios.get(pdfUrl, {
        responseType: 'arraybuffer'
      });

      this.logger.debug('Extracting text from PDF');
      const data = await pdfParse(response.data);
      
      this.logger.debug(`Text extraction completed. Characters extracted: ${data.text.length}`);
      this.logger.log("extract data from pdf", data.text);
      return data.text;
    } catch (error) {
      this.logger.error('Failed to extract text from PDF', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private async parseTextWithAI(text: string): Promise<ParsedPrescription> {
    try {
      this.logger.debug('Parsing text with OpenAI');
      
      const prompt = `
        Extract the following information from this prescription text:
        - Patient/Customer Name
        - Doctor Name or Clinic Name (if doctor name is not available, extract clinic/hospital name)
        - Prescription Date (in YYYY-MM-DD format)
        - Medicine Name(s)

        Text:
        ${text}

        Return the data in JSON format with these exact keys:
        {
          "customerName": string,
          "doctorName": string, // Use clinic name if doctor name is not found
          "date": string (YYYY-MM-DD),
          "medicineName": string,
          "confidence": number (0-1)
        }
      `;

      const completion = await this.openai.chat.completions.create({
        model: this.configService.get<string>('openai.model'),
        messages: [
          {
            role: "system",
            content: "You are a medical prescription parser. Extract key information from prescriptions and return it in JSON format. If doctor's name is not found, use clinic/hospital name instead."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const response = JSON.parse(completion.choices[0].message.content);
      this.logger.debug('OpenAI parsing result', response);

      return {
        ...response,
        date: new Date(response.date)
      };
    } catch (error) {
      this.logger.error('Failed to parse text with AI', error);
      throw new Error('Failed to parse prescription with AI');
    }
  }
} 