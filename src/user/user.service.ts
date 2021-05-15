import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { UserRepository } from 'src/typeorm/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(): Promise<User[]> {
    console.log('유저 확인');

    const users = await this.userRepository.find();
    if (!users) {
      console.log('유저 없음');
      throw new BadRequestException('유저가 없습니다.');
    }
    return users;
  }
}
