import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { MedicineType } from '../../shared/enums/medicine-type.enum';

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column('json', { nullable: true })
  parsedData: {
    customerName: string;
    doctorName: string;
    date: Date;
    medicineName: string;
    confidence: number;
  };

  @Column({
    type: 'enum',
    enum: MedicineType,
    default: MedicineType.BIRTH_CONTROL
  })
  medicineType: MedicineType;

  @Column({ type: 'text', nullable: true })
  transcript: string;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => Doctor, doctor => doctor.prescriptions)
  doctor: Doctor;

  @ManyToOne(() => Customer, customer => customer.prescriptions)
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;
} 