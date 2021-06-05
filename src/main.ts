import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as rateLimit from 'express-rate-limit';

import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as passport from 'passport';
import { setSwagger } from './set-swagger';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
// import { Server, createServer } from 'https';
// import express from 'express';

import { ExpressPeerServer } from 'peer';

// const httpsOptions = {
//   key: fs.readFileSync('src/key.pem'),
//   cert: fs.readFileSync('src/cert.pem'),
// };
export async function bootstrap() {
  //   const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //   const app = await NestFactory.create<NestExpressApplication>(
  //     //   const app = await NestFactory.create<NestExpressApplication>(
  //     AppModule,
  //     new ExpressAdapter(expressApp),
  //   );

  const env = app.get(ConfigService);
  const allowedHosts = env.get('allowed-hosts');

  const port = env.get('port') || 3333;
  app.set('trust proxy', 1);
  //   app.enableCors({ credentials: true, origin: 'http://localhost:3333' });
  //   app.enableCors();
  app.enableCors({
    origin: allowedHosts,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for',
  });

  app.use(
    session({
      cookie: {
        maxAge: 60000 * 60 * 24,
      },
      secret: env.get('cookie-secret'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(cookieParser());
  //   app.use(csurf({ cookie: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  if (isProd) {
    app.use(helmet());

    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );
    app.enableShutdownHooks();
  }

  app.use(passport.initialize());
  app.use(passport.session());
  app.setGlobalPrefix('api');

  setSwagger(app);

  await app.listen(port, () => console.log(`서버 port: ${port}로 열림`));

  //   return app;
}
bootstrap();
