import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  connectedUsers: string[] = [];

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    return data;
    // return 'Hello world!';
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody() data: unknown): Observable<WsResponse<number>> {
    const event = 'join';
    const response = [1, 2, 3];

    return from(response).pipe(map((data) => ({ event, data })));
  }
}
