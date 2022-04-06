import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LoggerGateway implements OnGatewayInit {
  @WebSocketServer()
  private server: Server;

  authenticated() {
    this.server.emit('authenticated');
  }

  sendQr(data: string) {
    this.server.emit('qr', data);
  }

  log(data: string) {
    this.server.emit('log', data);
  }

  afterInit(server: Server) {}
}
