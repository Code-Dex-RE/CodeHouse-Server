import {
  BadRequestException,
  Injectable,
  Logger,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from 'src/user/repository/user.repository';
import { User } from 'src/typeorm/entities/User';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  // 깃 어스 로그인 성공 -> 프런트 회원가입 폼으로 req_user 전송?
  async socialLogin(req) {
    //   async socialLogin(req, res: Response) {
    if (!req.user) {
      throw new BadRequestException('로그인 안되었습니다.');
    }
    const { provider, avatar, social_id, bio, email, name } = req.user;

    const user = await this.userRepository.findOne({ email });
    this.logger.verbose(`소셜`);

    //유저가 없으면 로그인 폼으로 리디렉션
    if (!user) {
      const newUser = await this.userRepository.createUser(req.user);
      this.logger.verbose(`소셜 회원가입`);
      console.log(newUser);
      return {
        message: '소셜 깃헙으로 회원가입',
        user: newUser,
        accessToken: this.jwtService.sign({ userId: newUser.id }),
      };
    }
    this.logger.verbose(`소셜 로그인 : ${user}`);
    console.log(user);

    return {
      message: '소셜 깃헙으로 로그인 하였습니다!',
      user: req.user,
      accessToken: this.jwtService.sign({ userId: user.id }),
    };

    //유저 있으면 액세스 토큰 발급
  }
}
