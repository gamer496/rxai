import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    // Try to find user in both repositories
    const customer = await this.customersRepository.findOne({ where: { username } });
    const doctor = await this.doctorsRepository.findOne({ where: { username } });
    
    const user = customer || doctor;
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      username: user.username, 
      sub: user.id,
      userType: user.userType 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      userType: user.userType
    };
  }

  logout() {
    // In JWT, logout is typically handled client-side by removing the token
    return { message: 'Logged out successfully' };
  }
} 