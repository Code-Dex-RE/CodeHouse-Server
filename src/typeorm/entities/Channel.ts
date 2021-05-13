import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
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
import { User } from './User';

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
  @Column({ unique: true })
  name!: string;

  @ApiProperty({
    description: '채널 설명입니다.',
    example: '1번 채널입니다. 게임하면서 음성 채팅해요',
  })
  @IsString()
  @Column()
  description!: string;

  @ApiProperty({ example: '채널 소켓 아이디?' })
  @Column({ nullable: true })
  @IsString()
  url: string;

  @ApiProperty({ example: '채널 소켓 아이디?', required: false })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  dep?: string;

  // Relations Ids

  @RelationId((self: Channel) => self.chat)
  chat_id!: string[];

  @RelationId((self: Channel) => self.member)
  member_id!: string[];

  @Column()
  host_id!: number;

  // Relations
  @OneToMany((type) => ChannelChat, (chat) => chat.channel, { cascade: true })
  chat!: ChannelChat[];

  @OneToMany((type) => ChannelMember, (member) => member.channel, {
    cascade: true,
  })
  member!: ChannelMember[];

  @ApiProperty({ description: '방 제공자 입니다.', example: '빌게이츠' })
  @ManyToOne((type) => User, (host) => host.mychannel, { cascade: true })
  @JoinColumn({ name: 'host_id', referencedColumnName: 'id' })
  host!: User;
}
