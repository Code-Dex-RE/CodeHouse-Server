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
export class ChannelMember {
  // Columns
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ApiProperty({ readOnly: true, description: 'member 추가' })
  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @ApiProperty({ readOnly: true, description: 'member 삭제일' })
  @Column('timestamptz')
  @DeleteDateColumn()
  readonly deleted_at: Date;

  // Relations Ids
  @ApiProperty({ readOnly: true })
  @Column()
  channel_id!: string;

  @ApiProperty({ readOnly: true })
  @Column()
  user_id!: string;

  // Relations
  @ManyToOne((type) => Channel, (channel) => channel.member)
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
  channel!: Channel;

  @ManyToOne((type) => User, (user) => user.channel)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;
}
