import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { Provider } from 'src/typeorm/entities/User';

export class CreateUserDto {
  @ApiProperty({
    description: '회원 이름 입니다.',
    example: 'Pro4',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@doe.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false, example: 'gopher' })
  @IsString()
  @IsOptional()
  @Length(3, 50)
  bio?: string;

  @ApiProperty({ required: false, example: 'awa://이미지-주소' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ enum: Provider, enumName: 'Provider' })
  provider: Provider;
}
