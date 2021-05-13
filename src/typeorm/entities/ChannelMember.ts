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

@Entity({ name: 'channel_members' })
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
  @ApiProperty()
  @Column()
  channel_id!: number;

  @ApiProperty()
  @Column()
  user_id!: number;

  // Relations
  @ManyToOne((type) => Channel, (channel) => channel.member)
  @JoinColumn({ name: 'channel_id' })
  channel!: Channel;

  @ManyToOne((type) => User, (user) => user.channel, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
