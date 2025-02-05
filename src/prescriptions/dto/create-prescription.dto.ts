export class CreatePrescriptionDto {
  name: string;
  url: string;
  customerId?: number;  // Optional for doctors to specify customer
} 