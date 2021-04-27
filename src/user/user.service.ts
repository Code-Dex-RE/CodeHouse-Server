import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/typeorm/entities/User';
import { UserRepository } from 'src/typeorm/repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async getUsers(): Promise<User[]> {
    // console.log(this.configService.get('allowed-hosts'));
    const users = await this.userRepository.find();
    return users;
  }
}
