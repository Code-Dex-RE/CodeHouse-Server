import { Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }
}
