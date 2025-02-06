import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoggerService } from '../shared/services/logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('AuthController');
  }

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    this.logger.log(`Login attempt for user: ${loginDto.username}`);
    try {
      return this.authService.login(loginDto.username, loginDto.password);
    } catch (error) {
      this.logger.error('Login failed:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return this.authService.logout();
  }
} 