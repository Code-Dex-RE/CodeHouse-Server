import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { Channel } from '../entities/Channel';

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {
  async createChannel(data: CreateChannelDto) {
    const newChannel = new Channel();
    newChannel.name = data.name;
    newChannel.url = data.url;
    newChannel.host = data.host;

    try {
      this.save(newChannel);
    } catch (error) {
      throw new BadRequestException('채널 생성 오류', error);
    }
    return newChannel;
  }
}
