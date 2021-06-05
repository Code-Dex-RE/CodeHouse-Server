import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/type-orm.config';
import { PassportModule } from '@nestjs/passport';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // CacheModule.register(),
    UserModule,
    AuthModule,
    PassportModule.register({ session: true }),
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(typeOrmConfig),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
