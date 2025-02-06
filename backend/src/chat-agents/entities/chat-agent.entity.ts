import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatAgent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  endpointUrl: string;

  @Column({ unique: true })
  medicineCategory: string;
} 