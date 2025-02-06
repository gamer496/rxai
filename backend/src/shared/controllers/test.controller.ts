import { Controller, Post, UseGuards } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('test')
export class TestController {
  constructor(
    @InjectDataSource() private dataSource: DataSource
  ) {}

  @Post('reset-db')
  async resetDatabase() {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();
    return { message: 'Database reset successful' };
  }
} 