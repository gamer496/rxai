import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Customer } from './customers/entities/customer.entity';
import { Doctor } from './doctors/entities/doctor.entity';
import { Prescription } from './prescriptions/entities/prescription.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Customer, Doctor, Prescription],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {} 