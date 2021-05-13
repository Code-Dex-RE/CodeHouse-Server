import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { entities } from '../typeorm/index';
const inContainer = Boolean(process.env.IN_CONTAINER);
// const inContainer = JSON.parse(process.env.IN_CONTAINER);

export const typeOrmConfig: TypeOrmModuleOptions = inContainer
  ? {
      type: 'postgres',
      //   url: process.env.DATABASE_URL,
      host: 'pro4.cklvpmwsssul.ap-northeast-2.rds.amazonaws.com',
      port: 5432,
      database: 'postgres',
      username: 'pro4',
      password: 'pro4pro4',
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
// pro4.cklvpmwsssul.ap-northeast-2.rds.amazonaws.com

// {
//     type: 'postgres',
//     url: process.env.DATABASE_URL,
//     synchronize: true,
//     logging: true,
//     entities,
//   }
