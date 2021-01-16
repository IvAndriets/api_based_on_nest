import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { publicDecrypt } from 'crypto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
