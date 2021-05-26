import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Channel } from './Channel';
import { User } from './User';

@Entity({ name: 'channel_chats' })
export class ChannelChat {
  // Columns
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ApiProperty({ readOnly: true, description: 'Chat 생성일' })
  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @ApiProperty({ readOnly: true, description: 'Chat 삭제일' })
  @Column('timestamptz')
  @DeleteDateColumn()
  readonly deleted_at: Date;

  @ApiProperty({ description: '채팅 내용', example: '안녕하세요 채팅입니다.' })
  @Column({ type: 'text' })
  @IsString()
  comment: string;

  // Relations Ids
  @ApiProperty()
  @Column()
  channel_id!: number;

  @ApiProperty()
  @Column()
  user_id!: number;

  // Relations
  @ManyToOne((type) => User, (user) => user.chat)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @ManyToOne((type) => Channel, (channel) => channel.chat)
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
  channel!: Channel;
}
