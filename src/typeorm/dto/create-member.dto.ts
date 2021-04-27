import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateMemberDto {
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
