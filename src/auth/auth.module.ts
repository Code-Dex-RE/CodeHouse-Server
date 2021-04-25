import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from './passport/github.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
