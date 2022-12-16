import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe()); //this validates the data with the ValidationPipe

  // Swagger
  const config = new DocumentBuilder() //this creates a documentBuilder for validation with swagger
    .setTitle('Vagas-Backend')
    .setDescription('App for Vagas-Backend.')
    .setVersion('1.0.0')
    .addTag('status')
    .addTag('auth')
    .addTag('comment')
    .addTag('job')
    .addTag('report')
    .addTag('user')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3333);
  console.info(`🚀🚀 App listening on port ${process.env.PORT} 🚀🚀`);
}
bootstrap();
