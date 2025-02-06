import { Entity, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Prescription } from '../../prescriptions/entities/prescription.entity';

@Entity('doctors')
export class Doctor extends User {
  readonly userType = 'doctor';

  @OneToMany(() => Prescription, prescription => prescription.doctor)
  prescriptions: Prescription[];
} 