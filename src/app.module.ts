import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { DoctorsModule } from './doctors/doctors.module';
import { Customer } from './customers/entities/customer.entity';
import { Doctor } from './doctors/entities/doctor.entity';
import { Prescription } from './prescriptions/entities/prescription.entity';
import { AppController } from './app.controller';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { SharedModule } from './shared/shared.module';
import { ChatAgentsModule } from './chat-agents/chat-agents.module';
import { ChatAgent } from './chat-agents/entities/chat-agent.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'rxai',
      entities: [Customer, Doctor, Prescription, ChatAgent],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    CustomersModule,
    DoctorsModule,
    PrescriptionsModule,
    SharedModule,
    ChatAgentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {} 