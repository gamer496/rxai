import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Customer } from '../customers/entities/customer.entity';
import { PrescriptionParserService } from './services/prescription-parser.service';
import { LoggerService } from '../shared/services/logger.service';

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
    if (!customer) {
      this.logger.warn(`Customer not found: ${customerId}`);
      throw new NotFoundException('Customer not found');
    }

    this.logger.debug('Parsing prescription data');
    const parsedData = await this.prescriptionParserService.parse(createPrescriptionDto.url);

    const prescription = this.prescriptionsRepository.create({
      ...createPrescriptionDto,
      customer,
      parsedData,
    });

    const savedPrescription = await this.prescriptionsRepository.save(prescription);
    this.logger.log(`Prescription created with ID: ${savedPrescription.id}`);
    return savedPrescription;
  }

  async createDoctorPrescription(doctorId: number, createPrescriptionDto: CreatePrescriptionDto) {
    const doctor = await this.doctorsRepository.findOne({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const customer = await this.customersRepository.findOne({ 
      where: { id: createPrescriptionDto.customerId } 
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const prescription = this.prescriptionsRepository.create({
      ...createPrescriptionDto,
      doctor,
      customer,
    });

    return this.prescriptionsRepository.save(prescription);
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