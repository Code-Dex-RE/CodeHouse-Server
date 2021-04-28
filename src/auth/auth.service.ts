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
  private readonly client_url_home = 'http://localhost:8000/home';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async socialLogin(@Req() req, @Res() res: Response) {
    if (!req.user) {
      throw new BadRequestException('로그인 안되었습니다.');
    }
    console.log('유저 : ', req.user);
    const { email, provider } = req.user;
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      //   req.session.vaild = req.user;
      const newUser = new User();
      newUser.email = email;
      newUser[provider] = true;
      await this.userRepository.save(newUser);

      const accessToken = this.jwtService.sign({ userId: newUser.id });
      res.cookie('jwt', accessToken, { httpOnly: true });

      return res.redirect(this.client_url_signup);
    }

    if (provider === 'github' && !user.github) {
      user[provider] = true;
      await this.userRepository.save(user);
    }
    if (provider === 'kakao' && !user.kakao) {
      user[provider] = true;
      await this.userRepository.save(user);
    }

    const accessToken = this.jwtService.sign({ userId: user.id });

    //유저 이름 설정 안되어있으면 회원가입 창으로 리디렉션
    if (user.name === null) {
      res.cookie('jwt', accessToken, { httpOnly: true });
      return res.redirect(this.client_url_signup);
    }

    res.cookie('jwt', accessToken, { httpOnly: true });
    return res.redirect(this.client_url_home);
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
