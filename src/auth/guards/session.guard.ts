import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    try {
      if (request.session.passport.user) {
        // console.log(
        //   '세션가드, 리퀘스트 세션 페스포트 유저 :',
        //   request.session.passport.user,
        // );
        // console.log(request.session.passport);
        return true;
      }
    } catch (e) {
      throw new UnauthorizedException('세션가드 시리얼라이즈 안됨', e);
    }
  }
}
