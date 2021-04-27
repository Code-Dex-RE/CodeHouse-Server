import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ description: ' 채널 이름입니다.', example: '1번 채널입니다.' })
  name: string;

  @ApiProperty({ description: '채널 주소입니다.', example: '1번 소켓' })
  url: string;

  @ApiProperty({ description: '채널 주인입니다.', example: '채널장' })
  host: string;
}
