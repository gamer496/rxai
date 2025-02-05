import { MedicineType } from '../../shared/enums/medicine-type.enum';

export class CreatePrescriptionDto {
  medicineName: string;
  medicineType: MedicineType;
  transcript?: string;
  customerId: number;
  doctorId: number;
} 