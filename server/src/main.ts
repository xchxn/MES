import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('SFM example')
    .setDescription('The SFM API description')
    .setVersion('1.0')
    .addTag('SFM')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001); //클라이언트 테스트가 localhost:3000이라 임시로 localhost:3001 할당 추후 url로 변경해야함
}
bootstrap();
