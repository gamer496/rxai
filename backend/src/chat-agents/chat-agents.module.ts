import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatAgentsService } from './chat-agents.service';
import { ChatAgentsController } from './chat-agents.controller';
import { ChatAgent } from './entities/chat-agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatAgent])],
  controllers: [ChatAgentsController],
  providers: [ChatAgentsService],
  exports: [ChatAgentsService],
})
export class ChatAgentsModule {} 