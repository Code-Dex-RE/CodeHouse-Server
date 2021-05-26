import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { ChannelChat } from './ChannelChat';
import { ChannelMember } from './ChannelMember';
import { Channel } from './Channel';
import { ExclusionMetadata } from 'typeorm/metadata/ExclusionMetadata';

export enum Provider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  KAKAO = 'kakao',
}

@Entity({ name: 'users' })
export class User {
  // Columns
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'aksjaslkdjfl@gmail.com' })
  @Column()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: '회원 이름입니다.',
    example: 'Pro4',
    required: false,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false, example: 'aws://이미지-주소' })
  @Column({ nullable: true })
  @IsString()
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @Column({ nullable: true })
  //   @ExclusionMetadata()
  currentHasedRefreshToken?: string;

  //   @ApiProperty({ enum: Provider, enumName: 'Provider' })
  //   @Column({ type: 'enum', enum: Provider, default: Provider.GITHUB })
  //   @IsEnum(Provider)
  //   provider: Provider;
  @ApiProperty({ description: '깃허브로 소셜 회원가입을 했나?' })
  @Column({ default: false })
  @IsBoolean()
  github: boolean;

  @ApiProperty({ description: '카카오로 소셜 회원가입을 했나?' })
  @Column({ default: false })
  @IsBoolean()
  kakao: boolean;

  // Relations Ids
  @RelationId((self: User) => self.chat)
  chat_id!: string[];

  @RelationId((self: User) => self.channel)
  channel_id!: string[];

  // Relations
  @OneToMany((type) => ChannelChat, (chat) => chat.user, { cascade: true })
  chat: ChannelChat[];

  @OneToMany((type) => ChannelMember, (channel) => channel.user, {
    // cascade: true,
    // onDelete: 'CASCADE',
  })
  
  channel: ChannelMember[];

  @OneToMany((type) => Channel, (mychannel) => mychannel.host)
  mychannel: Channel[];
}
