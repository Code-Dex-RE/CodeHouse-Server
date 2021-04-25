import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  connectedUsers: string[] = [];

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.server.emit('msgToClient', payload);
    // return 'Hello world!';
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody() data: unknown): Observable<WsResponse<number>> {
    const event = 'join';
    const response = [1, 2, 3];

    return from(response).pipe(map((data) => ({ event, data })));
  }
}
