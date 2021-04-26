import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export enum Provider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
}
@Entity({ name: 'users' })
export class User {
  // Columns
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '회원 이름입니다.', example: 'Pro4' })
  @Column()
  name: string;

  @ApiProperty({ example: 'aksjaslkdjfl@gmail.com' })
  @Column()
  email: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  bio: string;

  @ApiProperty({ required: false, example: 'aws://이미지-주소' })
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty({ enum: Provider, enumName: 'Provider' })
  @Column({ type: 'enum', enum: Provider, default: Provider.GITHUB })
  //   @IsEnum(Provider)
  provider: Provider;
  // Relations Ids

  // Relations
}
