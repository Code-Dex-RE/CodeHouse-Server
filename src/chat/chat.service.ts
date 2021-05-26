import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateChannelDto } from 'src/typeorm/dto/create-channel.dto';
import { UpdateChannelDto } from 'src/typeorm/dto/update-channel.dto';
import { Channel } from 'src/typeorm/entities/Channel';
import { ChannelChat } from 'src/typeorm/entities/ChannelChat';
import { ChannelMember } from 'src/typeorm/entities/ChannelMember';
import { ChannelRepository } from 'src/typeorm/repository/channel.repository';
import { ChatRepository } from 'src/typeorm/repository/chat.repository';
import { MemberRepository } from 'src/typeorm/repository/member.repository';

@Injectable()
export class ChatService {
  constructor(
    
    private readonly channelRepository: ChannelRepository,
    private readonly chatRepository: ChatRepository,
    private readonly memberRepository: MemberRepository,
  ) {}
  async getChannels():Promise<Channel[]> {
    const channels = await this.channelRepository.find();
  //  console.log('wwr',channels)
    return channels;
  }

  async createChannel(req, data: CreateChannelDto) {
    console.log('방만들기 데이터', data);
    const { name, dep,url } = data;
    const newChannel = new Channel();
    newChannel.name = name;
    newChannel.dep=dep;
    newChannel.url = url;
    newChannel.host = req.user;

    await this.channelRepository.save(newChannel);
    return newChannel;
  }

  async updateChannel(req, data: UpdateChannelDto) {
    const channel = await this.channelRepository.findOne({
      host_id: req.user.id,
    });
    if (!channel) {
      throw new BadRequestException('수정할 채널이 없습니다.');
    }
    channel.name = data.name;
    await this.channelRepository.save(channel);

    return channel;
  }

  //채널 삭제 및 관련 멤버, 채팅 내역도 같이 삭제
  async deleteChannel(req) {
    const channel = await this.channelRepository.findOne({
      host_id: req.user.id,
    });
    if (!channel) {
      throw new BadRequestException('삭제할 채널이 없습니다.');
    }

    this.channelRepository.softDelete(channel);
  }

  /**
   * @todo 소켓통신으로 나중에 방참가
   */
  async joinChannel(req, channelId: number) {
    const preMember = this.memberRepository.findOne({ user_id: req.user.id });

    if (preMember) {
      throw new BadRequestException('이미 해당 채널에 참가하였습니다!');
    }

    const newMember = new ChannelMember();
    console.log('채널 아이디 : ', channelId);
    newMember.channel_id = channelId;
    newMember.user_id = req.user.id;

    await this.memberRepository.save(newMember);
    return newMember;
  }

  //방나가기
  async leaveChannel(req, channelId: number) {
    const member = await this.memberRepository.findOne({
      user_id: req.user.id,
      channel_id: channelId,
    });
    this.memberRepository.softDelete(member);
    return;
  }

  //채팅 관련 로직

  async getChatLogs() {
    const chat = await this.chatRepository.find();

    return chat;
  }

  //채팅 저장은 큐로 저장해야 하지 않을까?
  async createChat(req, channelId: number) {
    const chat = new ChannelChat();

    chat.channel_id = channelId;
    chat.user_id = req.user.id;
    chat.comment = '채팅입니다.';

    await this.chatRepository.save(chat);
  }

  async deleteChat(req, chatId: number) {
    const preChat = await this.chatRepository.findOne({
      id: chatId,
      user_id: req.user.id,
    });

    this.chatRepository.delete(preChat);
  }

  async kickMember(userId: number, channelId: number, memberId: number) {
    const is_channel_host = await this.channelRepository.findOne({
      id: channelId,
      host_id: userId,
    });
    if (!is_channel_host) {
      throw new BadRequestException('이 방의 호스트가 아닙니다.');
    }
    this.memberRepository.delete({ id: memberId, channel_id: channelId });
  }
}
