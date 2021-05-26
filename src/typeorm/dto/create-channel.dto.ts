import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumberString, IsOptional } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty({ description: ' 채널 이름입니다.', example: '1번 채널입니다.' })
  @IsString()
  name: string;

  @ApiProperty({ description: ' 채널 설명입니다.', example: '여기는 아무말!.' })
  @IsString()
  dep: string;

  @ApiProperty({ description: '채널 주소입니다.', example: '1번 소켓' })
  @IsNumberString()
  @IsOptional()
  url?: string;
}
