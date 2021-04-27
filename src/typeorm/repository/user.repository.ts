/* eslint-disable @typescript-eslint/no-empty-function */
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(data: CreateUserDto) {}
}
