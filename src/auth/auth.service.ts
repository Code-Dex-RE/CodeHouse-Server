import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';

@Injectable()
export class AuthService {
  //   constructor() {}

  async socialLogin(req) {
    if (!req.user) {
      throw new BadRequestException('로그인 안되었습니다.');
    }
    const { provider, social_id, email } = req.user;

    return {
      message: 'User Information from GitHub',
      user: req.user,
    };
  }
}
