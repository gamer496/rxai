import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DoctorGuard } from '../auth/doctor.guard';

@Controller('doctor/prescriptions')
@UseGuards(JwtAuthGuard, DoctorGuard)
export class DoctorPrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  create(@Request() req, @Body() createPrescriptionDto: CreatePrescriptionDto) {
    if (!createPrescriptionDto.customerId) {
      throw new Error('Customer ID is required for doctor prescriptions');
    }
    return this.prescriptionsService.createDoctorPrescription(
      req.user.userId,
      createPrescriptionDto,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.prescriptionsService.findDoctorPrescriptions(req.user.userId);
  }
} 