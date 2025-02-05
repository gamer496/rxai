import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);
    const doctor = this.doctorsRepository.create({
      ...createDoctorDto,
      password: hashedPassword,
    });
    return this.doctorsRepository.save(doctor);
  }

  findAll() {
    return this.doctorsRepository.find({
      select: ['id', 'username', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number) {
    const doctor = await this.doctorsRepository.findOne({
      where: { id },
      select: ['id', 'username', 'createdAt', 'updatedAt'],
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor #${id} not found`);
    }
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.findOne(id);
    if (updateDoctorDto.password) {
      updateDoctorDto.password = await bcrypt.hash(updateDoctorDto.password, 10);
    }
    await this.doctorsRepository.update(id, updateDoctorDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const doctor = await this.findOne(id);
    return this.doctorsRepository.remove(doctor);
  }
} 