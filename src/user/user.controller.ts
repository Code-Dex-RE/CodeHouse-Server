import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/typeorm/entities/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiCreatedResponse({
    description: '유저 목록',
    type: [User],
  })
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
