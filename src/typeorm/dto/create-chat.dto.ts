import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  IsNumber,
} from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: '채팅 내용입니다.',
    example: '안녕하세요 채팅입니다.',
  })
  @IsString()
  comment: string;

  @ApiProperty({
    description: '유저아이디',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: '채널아이디',
  })
  @IsNumber()
  channel_id: number;
}
