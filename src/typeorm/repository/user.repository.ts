import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(data: CreateUserDto) {
    const { email, provider, avatar, bio, name } = data;
    const user = await this.findOne({ email });
    if (user) {
      console.log('이미 회원가입된 유저 :', user);
      throw new BadRequestException(
        '이미 해당 이메일은 회원가입 되어있습니다.',
      );
    }

    const newUser = this.create({ email, provider, avatar, bio, name });
    try {
      await this.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return newUser;
  }
  async createUserLocal(data: CreateUserDto) {
    const {} = data;

    const user = this.create(data);

    try {
      this.save(user);

      return user;
    } catch {
      console.error;
    }
  }
}
