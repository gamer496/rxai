import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Customer } from '../customers/entities/customer.entity';
import { PrescriptionParserService } from './services/prescription-parser.service';
import { LoggerService } from '../shared/services/logger.service';
import { MedicineType } from '../shared/enums/medicine-type.enum';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionsRepository: Repository<Prescription>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    private prescriptionParserService: PrescriptionParserService,
    private logger: LoggerService
  ) {
    this.logger.setContext('PrescriptionsService');
  }

  async createCustomerPrescription(customerId: number, createPrescriptionDto: CreatePrescriptionDto) {
    this.logger.log(`Creating prescription for customer: ${customerId}`);
    
    const customer = await this.customersRepository.findOne({ where: { id: customerId } });
    if (!customer || !createPrescriptionDto.prescriptionUrl) {
      this.logger.warn(`Customer not found: ${customerId}`);
      throw new NotFoundException('Customer not found');
    }

    this.logger.debug('Parsing prescription data');
    const parsedData = await this.prescriptionParserService.parse(createPrescriptionDto.prescriptionUrl);

    const prescription = this.prescriptionsRepository.create({
      url: createPrescriptionDto.prescriptionUrl,
      customer,
      parsedData,
      medicineType: MedicineType.BIRTH_CONTROL,
      name: `${customer.username}_${parsedData.medicineName}_${Date.now()}`,
    });

    const savedPrescription = await this.prescriptionsRepository.save(prescription);
    this.logger.log(`Prescription created with ID: ${savedPrescription.id}`);
    return savedPrescription;
  }

  async findCustomerPrescriptions(customerId: number) {
    return this.prescriptionsRepository.find({
      where: { customer: { id: customerId } },
      relations: ['doctor'],
    });
  }

  async findDoctorPrescriptions(doctorId: number) {
    return this.prescriptionsRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['customer'],
    });
  }
} 