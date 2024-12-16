import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
