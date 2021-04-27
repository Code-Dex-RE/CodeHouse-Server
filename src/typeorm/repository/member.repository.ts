import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMemberDto } from '../dto/create-member.dto';
import { ChannelMember } from '../entities/ChannelMember';

@EntityRepository(ChannelMember)
export class MemberRepository extends Repository<ChannelMember> {
  async createChannel(data: CreateMemberDto) {
    const member = new ChannelMember();
    member.user_id = data.user_id;
    member.channel_id = data.channel_id;

    try {
      this.save(member);
    } catch (error) {
      throw new BadRequestException('채널 생성 오류', error);
    }
    return member;
  }
}
