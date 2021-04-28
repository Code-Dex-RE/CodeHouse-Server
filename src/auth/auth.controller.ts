import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/typeorm/dto/create-user.dto';
import { User } from 'src/typeorm/entities/User';
import { AuthService } from './auth.service';
// import { AuthenticatedGuard } from './guards/auth.guard';
import { GithubAuthGuard } from './guards/github.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { KakaoAuthGuard } from './guards/kakao.guard';
// import { JwtAuthGuard } from './guards/jwt.guard';
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
    return this.authService.socialLogin(req, res);
  }

  @Get('kakao')
  @ApiOperation({ description: '깃헙 OAuth2로 로그인 및 회원가입' })
  @ApiOAuth2(['user:email'], 'github')
  @ApiOkResponse({ description: '깃헙 접근 성공' })
  @UseGuards(KakaoAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async kakaoAuth(@Req() req): Promise<void> {}

  @Get('kakao/callback')
  @ApiExcludeEndpoint()
  @UseGuards(KakaoAuthGuard)
  kakaoAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.socialLogin(req, res);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: '유저 회원가입',
    type: User,
  })
  registerUser(@Req() req, @Body() data: CreateUserDto) {
    return this.authService.register(req, data);
  }

  @Get('me')
  @ApiCreatedResponse({
    description: '유저 확인',
    type: User,
  })
  //   @UseGuards(JwtAuthGuard)
  @UseGuards(SessionGuard)
  gitStatus(@SessionUser() user: any) {
    return user;
  }

  @ApiCreatedResponse({
    description: '유저 로그아웃',
  })
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
