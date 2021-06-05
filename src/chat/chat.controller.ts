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

  //채널 목록
  @Get()
  getChannels() {
    return this.chatService.getChannels();
  }

  // 채널 만들기
  @Post('')
  @UseGuards(JwtAuthGuard)
  createChannel(@Req() req, @Body() data: CreateChannelDto) {
    return this.chatService.createChannel(req, data);
  }

  //채널 수정
  @Patch()
  @UseGuards(JwtAuthGuard)
  updateChannel(@Req() req, @Body() data: UpdateChannelDto) {
    return this.chatService.updateChannel(req, data);
  }

  //채널 삭제
  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteChannel(@Req() req) {
    return this.chatService.deleteChannel(req);
  }

  //채널 참가
  @Get('join/:channelId')
  @UseGuards(JwtAuthGuard)
  joinChannel(@Req() req, @Param('channelId') channelId: number) {
    return this.chatService.joinChannel(req, channelId);
  }

  // 채널 유저 강퇴
  @Get('kick/:channel_id/:member_id')
  @UseGuards(JwtAuthGuard)
  kickMember(
    @Req() req,
    @Param('channel_id') channelId: number,
    @Param('member_id') memberId: number,
  ) {
    return this.chatService.kickMember(req.user.id, channelId, memberId);
  }
}
