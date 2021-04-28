import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: any, id?: any) => void): void {
    console.log('카카오 시리얼라이져');
    done(null, user);
  }
  deserializeUser(payload: any, done: (err: any, id?: any) => void): void {
    console.log('카카오 디시리얼라이져');

    done(null, payload);
  }
}
