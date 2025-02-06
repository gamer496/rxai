import { MedicineType } from '../../shared/enums/medicine-type.enum';

export class GeneratePrescriptionDto {
  transcript: string;
  customerId: number;
  medicineType: MedicineType;
} 