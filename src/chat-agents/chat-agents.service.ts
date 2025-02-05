import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatAgent } from './entities/chat-agent.entity';
import { CreateChatAgentDto } from './dto/create-chat-agent.dto';
import { UpdateChatAgentDto } from './dto/update-chat-agent.dto';
import { LoggerService } from '../shared/services/logger.service';

@Injectable()
export class ChatAgentsService {
  constructor(
    @InjectRepository(ChatAgent)
    private chatAgentsRepository: Repository<ChatAgent>,
    private logger: LoggerService,
  ) {
    this.logger.setContext('ChatAgentsService');
  }

  async create(createChatAgentDto: CreateChatAgentDto): Promise<ChatAgent> {
    const chatAgent = this.chatAgentsRepository.create(createChatAgentDto);
    return this.chatAgentsRepository.save(chatAgent);
  }

  async findAll(): Promise<ChatAgent[]> {
    return this.chatAgentsRepository.find();
  }

  async findOne(id: number): Promise<ChatAgent> {
    const chatAgent = await this.chatAgentsRepository.findOne({ where: { id } });
    if (!chatAgent) {
      throw new NotFoundException(`Chat agent with ID ${id} not found`);
    }
    return chatAgent;
  }

  async findByMedicineCategory(category: string): Promise<ChatAgent> {
    const chatAgent = await this.chatAgentsRepository.findOne({ 
      where: { medicineCategory: category } 
    });
    if (!chatAgent) {
      throw new NotFoundException(`Chat agent for medicine category ${category} not found`);
    }
    return chatAgent;
  }

  async update(id: number, updateChatAgentDto: UpdateChatAgentDto): Promise<ChatAgent> {
    const chatAgent = await this.findOne(id);
    Object.assign(chatAgent, updateChatAgentDto);
    return this.chatAgentsRepository.save(chatAgent);
  }

  async remove(id: number): Promise<void> {
    const chatAgent = await this.findOne(id);
    await this.chatAgentsRepository.remove(chatAgent);
  }
} 