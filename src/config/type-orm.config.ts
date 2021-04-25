import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { entities } from '../typeorm/index';
const inContainer = Boolean(process.env.IN_CONTAINER);
// const inContainer = JSON.parse(process.env.IN_CONTAINER);

export const typeOrmConfig: TypeOrmModuleOptions = inContainer
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      logging: true,
      entities,
    }
  : {
      type: 'postgres',
      url: 'asdfasdf',
      synchronize: true,
      logging: true,
      entities,
    };
