import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean;

    // console.log('깃허브 어스가드 :', result);
    await super.logIn(request);
    return result;
    // return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('유저가 없다');
    }
    return user;
  }
}
