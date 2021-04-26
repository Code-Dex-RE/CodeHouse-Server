import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Provider } from 'src/typeorm/entities/User';
// import { Provider } from 'src/users/entity/user.entity';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  //   private readonly logger = new Logger(GoogleStrategy.name);
  constructor(private readonly $: ConfigService) {
    super({
      clientID: $.get<string>('gitClientId'),
      clientSecret: $.get<string>('gitClientSecrets'),
      callbackURL: $.get<string>('gitCallbackURL'),
      proxy: true,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { email, sub, avatar_url, bio, name } = profile._json;

    const user = {
      provider: Provider.GITHUB,
      avatar: avatar_url,
      social_id: sub,
      bio,
      email: email || profile.emails[0].value,
      name,
    };

    done(null, user);
  }
}
