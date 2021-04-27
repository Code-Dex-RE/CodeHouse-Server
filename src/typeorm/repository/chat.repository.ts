import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ChannelChat } from '../entities/ChannelChat';

@EntityRepository(ChannelChat)
export class ChatRepository extends Repository<ChannelChat> {
  async createChat(data: CreateChatDto) {
    const chat = new ChannelChat();
    chat.comment = data.comment;
    chat.user_id = data.user_id;
    chat.channel_id = data.channel_id;

    try {
      this.save(chat);
    } catch (error) {
      throw new BadRequestException('채널 생성 오류', error);
    }
    return chat;
  }
}
