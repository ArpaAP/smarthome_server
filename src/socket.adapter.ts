import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*', // 필요한 도메인으로 제한하는 것이 좋습니다.
        methods: ['GET', 'POST'],
        transports: ['websocket', 'polling'],
        credentials: true,
      },
      pingInterval: 10000, // 기본값은 25000ms
      pingTimeout: 50000, // 기본값은 5000ms
      allowEIO3: true,
    });
    return server;
  }
}
