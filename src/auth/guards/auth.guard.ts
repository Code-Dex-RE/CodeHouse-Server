// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     console.log('어스가드 : ', context);
//     const request = context.switchToHttp().getRequest();
//     return Boolean(request.user);
//     // return JSON.parse(request.user);
//     // return true;
//   }
// }

// /**
//  *  @todo isAuthenticated가 안됨
//  */
// @Injectable()
// export class AuthenticatedGuard implements CanActivate {
//   async canActivate(context: ExecutionContext) {
//     const req = context.switchToHttp().getResponse();
//     return req.isAuthenticated();
//   }
// }
