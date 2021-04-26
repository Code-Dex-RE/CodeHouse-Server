import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/repository/user.repository';
import { User } from 'src/typeorm/entities/User';

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

    return user;
  }
}
