import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
// import { AuthenticatedGuard } from './guards/auth.guard';
import { GithubAuthGuard } from './guards/github.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { SessionGuard } from './guards/session.guard';
import { SessionUser } from './sessionuser.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @ApiOperation({ description: '깃헙 OAuth2로 로그인 및 회원가입' })
  @ApiOAuth2(['user:email'], 'github')
  @ApiOkResponse({ description: '깃헙 접근 성공' })
  @UseGuards(GithubAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubAuth(@Req() req): Promise<void> {}

  @Get('github/callback')
  @ApiExcludeEndpoint()
  @UseGuards(GithubAuthGuard)
  githubAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // @Res() res: Response
    return this.authService.socialLogin(req, res);
  }

  @Get('me')
  @UseGuards(SessionGuard)
  gitStatus(@SessionUser() user: any) {
    //   gitStatus(@Req() req) {
    return user;
    // return { user: req.user };
  }

  @Get('logout')
  //   @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request, @Res() res) {
    console.log('로그아웃 실행');
    req.logOut();
    return res.redirect('/');
    //클라이언트 홈 URL
    // res.redirect('/');
  }

  @Get('test')
  testSeesion(@Req() req) {
    return this.authService.testSeesion(req);
  }
}
