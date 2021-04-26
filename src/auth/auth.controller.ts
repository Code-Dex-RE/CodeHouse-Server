import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './guards/auth.guard';
import { GithubAuthGuard } from './guards/github.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubAuth(@Req() req): Promise<void> {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  githubAuthRedirect(@Req() req: Request) {
    // @Res() res: Response
    return this.authService.socialLogin(req);
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request, @Res() res: Response) {
    req.logOut();
    // res.redirect('/');
  }
}
