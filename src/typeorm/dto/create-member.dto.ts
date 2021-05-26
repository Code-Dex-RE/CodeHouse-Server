import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length,IsNumber } from 'class-validator';

export class CreateMemberDto {
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
