// eslint-disable-next-line prettier/prettier
declare namespace NodeJS {
  export interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: string;
    ENVIRONMENT: Environment;
    GIT_CLIENT_ID?: string;
    GIT_CLIENT_SECRETS?: string;
    GIT_CALLBACK_URL?: string;
    IN_CONTAINER?: string;
    JWT_SECRET?: string;
    COOKIE_SECRET?: string;
    CLIENT_URL_SIGNUP?: string;
  }
  export type Environment = 'DEVELOPMENT' | 'PRODUCTION' | 'TEST';
}
