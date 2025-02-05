import { Entity, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Prescription } from '../../prescriptions/entities/prescription.entity';

@Entity('customers')
export class Customer extends User {
  readonly userType = 'customer';

  @OneToMany(() => Prescription, prescription => prescription.customer)
  prescriptions: Prescription[];
} 