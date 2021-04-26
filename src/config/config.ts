import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

// const validationSchema = Joi.object({
//   NODE_ENV: Joi.string()
//     .valid('development', 'test', 'production')
//     .default('development'),
// });

const configuration = () => ({
  'allowed-hosts': process.env.ALLOWED_HOSTS,
  port: process.env.PORT,
  gitClientId: process.env.GIT_CLIENT_ID,
  gitClientSecrets: process.env.GIT_CLIENT_SECRETS,
  gitCallbackURL: process.env.GIT_CALLBACK_URL,
  jwtSecret: process.env.JWT_SECRET,
  'cookie-secret': process.env.COOKIE_SECRET,
  client_url_signup: process.env.CLIENT_URL_SIGNUP,
});

export const config: ConfigModuleOptions = {
  isGlobal: true,
  ignoreEnvFile: false,
  //   validationSchema,
  load: [configuration],
};
