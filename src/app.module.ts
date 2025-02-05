import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { DoctorsModule } from './doctors/doctors.module';
import { Customer } from './customers/entities/customer.entity';
import { Doctor } from './doctors/entities/doctor.entity';
import { Prescription } from './prescriptions/entities/prescription.entity';
import { AppController } from './app.controller';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'rxai',
      entities: [Customer, Doctor, Prescription],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    CustomersModule,
    DoctorsModule,
    PrescriptionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {} 