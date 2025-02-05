import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Customer } from '../../customers/entities/customer.entity';

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

  @ManyToOne(() => Doctor, doctor => doctor.prescriptions)
  doctor: Doctor;

  @ManyToOne(() => Customer, customer => customer.prescriptions)
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;
} 