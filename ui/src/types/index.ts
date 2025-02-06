export interface Prescription {
  id: number;
  name: string;
  url: string;
  medicineType: string;
  transcript?: string;
  prescriptionUrl?: string;
  createdAt: string;
}

export interface ChatAgent {
  id: number;
  name: string;
  endpointUrl: string;
  medicineCategory: string;
} 