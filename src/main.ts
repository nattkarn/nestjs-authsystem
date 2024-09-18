import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      // ตัวเลือกนี้ทำให้สามารถกำหนดรูปแบบของ error response เมื่อการตรวจ validation ล้มเหลวได้
      const messages = errors.map((error) => ({
        field: error.property,
        message: Object.values(error.constraints).join('. ') + '.',
      }));
      return new BadRequestException({ errors: messages });
    },
  }));

  app.enableCors();
  app.use(cookieParser());
  // const config = new DocumentBuilder()
  //   .setTitle('Cats example')
  //   .setDescription('The cats API description')
  //   .setVersion('1.0')
  //   .addTag('cats')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
