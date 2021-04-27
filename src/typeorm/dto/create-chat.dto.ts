import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

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
  @IsString()
  user_id: string;

  @ApiProperty({
    description: '채널아이디',
  })
  @IsString()
  channel_id: string;
}
