import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from './passport/github.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import { GithubSerializer } from './passport/git.serializer';
import { UserRepository } from 'src/typeorm/repository/user.repository';
import { KakaoStrategy } from './passport/kakao.strategy';
import { KakaoSerializer } from './passport/kakao.serializer';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GithubStrategy,
    GithubSerializer,
    JwtStrategy,
    KakaoStrategy,
    KakaoSerializer,
  ],
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({
      session: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async ($: ConfigService) => ({
        secret: $.get<string>('jwtSecret'),
        signOptions: { expiresIn: '2h' },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
