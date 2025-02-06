import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatAgentsService } from './chat-agents.service';
import { CreateChatAgentDto } from './dto/create-chat-agent.dto';
import { UpdateChatAgentDto } from './dto/update-chat-agent.dto';
import { LoggerService } from '../shared/services/logger.service';

@Controller('chat-agents')
export class ChatAgentsController {
  constructor(
    private readonly chatAgentsService: ChatAgentsService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('ChatAgentsController');
  }

  @Post()
  create(@Body() createChatAgentDto: CreateChatAgentDto) {
    this.logger.log(`Creating new chat agent: ${createChatAgentDto.name}`);
    return this.chatAgentsService.create(createChatAgentDto);
  }

  @Get()
  findAll() {
    return this.chatAgentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatAgentsService.findOne(+id);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.chatAgentsService.findByMedicineCategory(category);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatAgentDto: UpdateChatAgentDto) {
    this.logger.log(`Updating chat agent ${id}`);
    return this.chatAgentsService.update(+id, updateChatAgentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Removing chat agent ${id}`);
    return this.chatAgentsService.remove(+id);
  }
} 