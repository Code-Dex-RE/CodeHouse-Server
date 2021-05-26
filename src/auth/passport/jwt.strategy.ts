import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/typeorm/entities/User';
import { UserRepository } from 'src/typeorm/repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly $: ConfigService,
    private readonly userRepostiroy: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: $.get<string>('jwtSecret'),
    });
  }

  async validate(payload: any): Promise<User> {
    const { userId } = payload;

    const user = await this.userRepostiroy.findOneOrFail(userId);
    // console.log('jwt 전략: 유저아이디', userId);
    // console.log('jwt 전략: 유저아이디', user);

    return user;
  }
}
