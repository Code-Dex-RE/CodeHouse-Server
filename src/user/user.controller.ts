import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/typeorm/entities/User';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  //   @UseInterceptors(CacheInterceptor)
  @ApiCreatedResponse({
    description: '유저 목록',
    type: [User],
  })
  async getUsers(@Query('search') search: string) {
    if (search) {
      //   return this.userService.searchForUserssearch);
    }
    return this.userService.getUsers();
  }
}
