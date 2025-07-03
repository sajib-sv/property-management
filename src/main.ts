import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { ENVEnum } from './common/enum/env.enum';
import { CustomExceptionsFilter } from './common/utils/exception-filter.util';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // * removes unexpected fields
      forbidNonWhitelisted: true, // * throws error if unknown field is present
      transform: true, // * auto-transform payloads to DTO instances
    }),
  );

  app.useGlobalFilters(new CustomExceptionsFilter());

  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  // * Swagger config
  const config = new DocumentBuilder()
    .setTitle('Property Management API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(configService.get<string>(ENVEnum.PORT) ?? '3000', 10);
  await app.listen(port);
}

void bootstrap();
