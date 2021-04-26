import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Open API
export const setSwagger = (app: NestExpressApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Pro4 API')
    .setDescription('Pro4 API specification')
    .setVersion('1.0')
    .addTag('asdfasdfsadf')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
