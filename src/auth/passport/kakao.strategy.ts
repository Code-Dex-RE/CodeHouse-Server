import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Provider } from 'src/typeorm/entities/User';
// import { Provider } from 'src/users/entity/user.entity';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  //   private readonly logger = new Logger(GoogleStrategy.name);
  constructor(private readonly $: ConfigService) {
    super({
      clientID: $.get<string>('kakaoClientId'),
      clientSecret: $.get<string>('kakaoClientSecrets'),
      callbackURL: $.get<string>('kakaoCallbackURL'),
      proxy: true,
      scope: ['account_email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const {
      id,
      kakao_account: {
        email,
        profile: { nickname },
      },
    } = profile._json;

    console.log('카카오 프로필 제이슨: ', profile._json);
    console.log('카카오 프로필 제이슨: ', id, email, nickname);
    const user = {
      provider: Provider.KAKAO,
      social_id: id,
      email: email,
      name: nickname,
    };

    done(null, user);
  }
}
