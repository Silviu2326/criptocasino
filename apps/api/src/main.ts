import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { validateConfig } from '@crypto-casino/config';

async function bootstrap() {
  const config = validateConfig(process.env);
  
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  app.enableCors({
    origin: config.security.cors.origin,
    credentials: config.security.cors.credentials,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Crypto Casino API')
    .setDescription('Provably-fair crypto casino API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.port, config.host);
  
  console.log(`🚀 Application is running on: http://${config.host}:${config.port}`);
  console.log(`📖 Swagger documentation: http://${config.host}:${config.port}/api/docs`);
}

bootstrap();