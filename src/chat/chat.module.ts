import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelRepository } from 'src/typeorm/repository/channel.repository';
import { ChatRepository } from 'src/typeorm/repository/chat.repository';
import { MemberRepository } from 'src/typeorm/repository/member.repository';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelRepository,
      ChatRepository,
      MemberRepository,
    ]),
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
