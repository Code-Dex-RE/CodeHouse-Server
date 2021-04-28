import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateChannelDto } from 'src/typeorm/dto/create-channel.dto';
import { UpdateChannelDto } from 'src/typeorm/dto/update-channel.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   *
   * @todo 전부다 임시임 -> chat gateway에서 서비스 로직 직접연결
   */
  @Get()
  getChannels() {
    return this.chatService.getChannels();
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  createChannel(@Req() req, @Body() data: CreateChannelDto) {
    return this.chatService.createChannel(req, data);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateChannel(@Req() req, @Body() data: UpdateChannelDto) {
    return this.chatService.updateChannel(req, data);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteChannel(@Req() req) {
    return this.chatService.deleteChannel(req);
  }

  @Get('join/:channelId')
  @UseGuards(JwtAuthGuard)
  joinChannel(@Req() req, @Param('channelId') channelId: string) {
    return this.chatService.joinChannel(req, channelId);
  }
}
