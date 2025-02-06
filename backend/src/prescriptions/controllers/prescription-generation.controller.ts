import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Prescription } from '../entities/prescription.entity';
import { GeneratePrescriptionDto } from '../dto/generate-prescription.dto';
import { LoggerService } from '../../shared/services/logger.service';

@Controller('prescriptions/generate')
export class PrescriptionGenerationController {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Prescription)
    private prescriptionsRepository: Repository<Prescription>,
    private logger: LoggerService,
  ) {
    this.logger.setContext('PrescriptionGenerationController');
  }

  @Post()
  async generate(@Body() generatePrescriptionDto: GeneratePrescriptionDto) {
    this.logger.log(`Generating prescription for customer ${generatePrescriptionDto.customerId}`);

    // Get random doctor
    const doctors = await this.doctorsRepository.find();
    if (!doctors.length) {
      throw new Error('No doctors available in the system');
    }
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];

    // Create new prescription
    const prescription = this.prescriptionsRepository.create({
      transcript: generatePrescriptionDto.transcript,
      medicineType: generatePrescriptionDto.medicineType,
      customer: { id: generatePrescriptionDto.customerId },
      doctor: randomDoctor,
    });

    return this.prescriptionsRepository.save(prescription);
  }
} 