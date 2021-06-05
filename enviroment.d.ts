/* eslint-disable prettier/prettier */
declare namespace NodeJS {
  export interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: string;
    ALLOWED_HOSTS?: string;
    ENVIRONMENT: Environment;
    GIT_CLIENT_ID?: string;
    GIT_CLIENT_SECRETS?: string;
    GIT_CALLBACK_URL?: string;
    IN_CONTAINER?: string;
    JWT_SECRET?: string;
    COOKIE_SECRET?: string;
    CLIENT_URL_SIGNUP?: string;
    KAKAO_CLIENT_ID?: string;
    KAKAO_CLIENT_SECRETS?: string;
    KAKAO_CALLBACK_URL?: string;
    AWS_HOST?: string;
    AWS_USER?: string;
    AWS_PW?: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
  }
  export type Environment = 'DEVELOPMENT' | 'PRODUCTION' | 'TEST';
}
