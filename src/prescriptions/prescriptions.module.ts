import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './entities/prescription.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { PrescriptionsService } from './prescriptions.service';
import { CustomerPrescriptionsController } from './customer-prescriptions.controller';
import { DoctorPrescriptionsController } from './doctor-prescriptions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription, Customer, Doctor])],
  providers: [PrescriptionsService],
  controllers: [CustomerPrescriptionsController, DoctorPrescriptionsController],
})
export class PrescriptionsModule {} 