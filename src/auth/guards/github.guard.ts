import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // console.log('어스가드 깃허브 : ', context);
    // console.log('어스가드 리퀘스트 :', request);

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('유저가 없다');
    }
    return user;
  }
}
