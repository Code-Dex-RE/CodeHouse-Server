import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    // console.log('jwt어스가드 :');
    return super.canActivate(context);

    // try {
    //   if (request.session.passport.user) {
    //     return true;
    //   }
    // } catch (e) {
    //   throw new UnauthorizedException('세션가드 시리얼라이즈 안됨', e);
    // }
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('유저가 없다');
    }
    return user;
  }
}
