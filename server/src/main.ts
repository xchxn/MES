import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3001); //클라이언트 테스트가 localhost:3000이라 임시로 localhost:3001 할당 추후 url로 변경해야함
}
bootstrap();
