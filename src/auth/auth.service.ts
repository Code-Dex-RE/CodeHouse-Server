import {
  BadRequestException,
  Injectable,
  Logger,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/typeorm/entities/User';
import { UserRepository } from 'src/typeorm/repository/user.repository';
import { CreateUserDto } from 'src/typeorm/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly client_url_signup = process.env.CLIENT_URL_SIGNUP;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async socialLogin(@Req() req, @Res() res) {
    if (!req.user) {
      throw new BadRequestException('로그인 안되었습니다.');
    }
    const { email, provider } = req.user;

    const user = await this.userRepository.findOne({ email });

    //유저가 없으면 로그인 폼으로 리디렉션
    // 유저가 로그인 클릭 -> 패스포트로 깃헙 로그인 -> 이메일과 프로바이더로 기초 회원가입
    // 클라 회원가입 폼으로 리디렉션 ->
    if (!user) {
      const newUser = new User();
      newUser.email = email;
      newUser[provider] = true;
      await this.userRepository.save(newUser);

      const accessToken = this.jwtService.sign({ userId: newUser.id });
      //   res.cookie('jwt', accessToken, { httponly: true });

      //   return res.redirect(this.client_url_signup);
      return {
        message: '회원가입 성공 후 리디렉션',
        user: newUser,
        accessToken,
      };
    }

    if (provider === 'github' && !user.github) {
      user[provider] = true;
      await this.userRepository.save(user);
    }
    if (provider === 'kakao' && !user.kakao) {
      user[provider] = true;
      await this.userRepository.save(user);
    }

    this.logger.verbose(`소셜 로그인 : ${user}`);

    const accessToken = this.jwtService.sign({ userId: user.id });
    // res.cookie('jwt', accessToken, { httponly: true });
    return {
      message: '소셜 로그인 하였습니다!',
      user: req.user,
      accessToken,
    };

    //유저 있으면 액세스 토큰 발급
  }

  async register(req, data: CreateUserDto) {
    const { email } = req.user;
    const { name, bio } = data;
    const newUser = await this.userRepository.findOne({ email });
    newUser.name = name;
    newUser.bio = bio;
    await this.userRepository.save(newUser);
    return newUser;
  }

  testSeesion(@Req() req) {
    const passedVariable = req.session.valid;
    req.session.valid = null;

    return { message: '리디렉션 데이터', passedVariable };
  }
}
