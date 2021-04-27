import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { ChannelChat } from './ChannelChat';
import { ChannelMember } from './ChannelMember';

@Entity({ name: 'channels' })
export class Channel {
  // Columns
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ApiProperty({ readOnly: true, description: '방 생성일' })
  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @ApiProperty({ description: '채널 이름입니다.', example: '1번 채널입니다' })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ example: '채널 소켓 아이디?' })
  @Column()
  @IsString()
  url: string;

  @ApiProperty({ description: '방 제공자 입니다.', example: 'Pro4' })
  @Column()
  @IsString()
  host: string;

  // Relations Ids

  @RelationId((self: Channel) => self.chat)
  chat_id!: string[];

  @RelationId((self: Channel) => self.member)
  member_id!: string[];

  // Relations
  @OneToMany((type) => ChannelChat, (chat) => chat.channel, { cascade: true })
  chat!: ChannelChat[];

  @OneToMany((type) => ChannelMember, (member) => member.channel, {
    cascade: true,
  })
  member!: ChannelMember[];
}
