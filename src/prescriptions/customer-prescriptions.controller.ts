import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomerGuard } from '../auth/customer.guard';

@Controller('customer/prescriptions')
@UseGuards(JwtAuthGuard, CustomerGuard)
export class CustomerPrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  create(@Request() req, @Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.createCustomerPrescription(
      req.user.userId,
      createPrescriptionDto,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.prescriptionsService.findCustomerPrescriptions(req.user.userId);
  }
} 