import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DoctorGuard } from '../auth/doctor.guard';
import { FileUploadService } from '../shared/services/file-upload.service';
import PDFDocument from 'pdfkit';

@Controller('doctor/prescriptions')
@UseGuards(JwtAuthGuard, DoctorGuard)
export class DoctorPrescriptionsController {
  constructor(
    private readonly prescriptionsService: PrescriptionsService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get()
  findAll(@Request() req) {
    return this.prescriptionsService.findDoctorPrescriptions(req.user.userId);
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    const prescription = await this.prescriptionsService.findOne(+id);
    const doctor = await this.prescriptionsService.findDoctor(prescription.doctor.id);

    // Generate PDF
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.fontSize(20).text(`Dr. ${doctor.username}'s Prescription`, { align: 'center' });
    doc.moveDown();
    
    // Create table
    doc.fontSize(12);
    doc.text('Medicine Name', 100, 150);
    doc.text('Date Generated', 300, 150);
    doc.moveTo(90, 170).lineTo(500, 170).stroke();
    doc.text(prescription.parsedData.medicineName, 100, 180);
    doc.text(new Date().toLocaleDateString(), 300, 180);

    doc.end();

    const pdfBuffer = Buffer.concat(chunks);
    
    // Upload to Dropbox
    const fileName = `approved_prescription_${prescription.id}_${Date.now()}.pdf`;
    const url = await this.fileUploadService.uploadFile(pdfBuffer, fileName);

    prescription.approved = true;
    prescription.url = url;
    return this.prescriptionsService.update(+id, prescription);
  }
} 