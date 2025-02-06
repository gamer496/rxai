import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './entities/prescription.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { PrescriptionsService } from './prescriptions.service';
import { CustomerPrescriptionsController } from './customer-prescriptions.controller';
import { DoctorPrescriptionsController } from './doctor-prescriptions.controller';
import { PrescriptionParserService } from './services/prescription-parser.service';
import { ParsingTestController } from './controllers/parsing-test.controller';
import { PrescriptionGenerationController } from './controllers/prescription-generation.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription, Customer, Doctor]), ConfigModule],
  providers: [PrescriptionsService, PrescriptionParserService],
  controllers: [CustomerPrescriptionsController, DoctorPrescriptionsController, ParsingTestController, PrescriptionGenerationController],
})
export class PrescriptionsModule {} 