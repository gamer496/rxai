import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DoctorGuard } from '../auth/doctor.guard';

@Controller('doctor/prescriptions')
@UseGuards(JwtAuthGuard, DoctorGuard)
export class DoctorPrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  findAll(@Request() req) {
    return this.prescriptionsService.findDoctorPrescriptions(req.user.userId);
  }
} 