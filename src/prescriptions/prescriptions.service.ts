import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionsRepository: Repository<Prescription>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async createCustomerPrescription(customerId: number, createPrescriptionDto: CreatePrescriptionDto) {
    const customer = await this.customersRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const prescription = this.prescriptionsRepository.create({
      ...createPrescriptionDto,
      customer,
    });

    return this.prescriptionsRepository.save(prescription);
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