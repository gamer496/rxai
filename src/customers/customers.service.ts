import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const hashedPassword = await bcrypt.hash(createCustomerDto.password, 10);
    const customer = this.customersRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
    });
    return this.customersRepository.save(customer);
  }

  findAll() {
    return this.customersRepository.find({
      select: ['id', 'username', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number) {
    const customer = await this.customersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'createdAt', 'updatedAt'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    if (updateCustomerDto.password) {
      updateCustomerDto.password = await bcrypt.hash(updateCustomerDto.password, 10);
    }
    await this.customersRepository.update(id, updateCustomerDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const customer = await this.findOne(id);
    return this.customersRepository.remove(customer);
  }
} 