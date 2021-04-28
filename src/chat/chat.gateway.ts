import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Channel } from 'src/typeorm/entities/Channel';
import { ChannelRepository } from 'src/typeorm/repository/channel.repository';
import { ChatRepository } from 'src/typeorm/repository/chat.repository';
import { MemberRepository } from 'src/typeorm/repository/member.repository';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private activeSockets: { room: string; id: string }[] = [];
  private chat: { room: string };
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly chatRepository: ChatRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  connectedUsers: string[] = [];

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    return data;
  }

  //클라
  // socket.emit("join", {room, userId});

  //서버
  @SubscribeMessage('join')
  @UseGuards(JwtAuthGuard)
  public async joinRoom(client: Socket, room: string): Promise<void> {
    const chat = await this.chatRepository.find({ channel_id: room });

    // const channel = new Channel();
    // channel.name = room;
    // channel.host = userId;

    const existingSocket = this.activeSockets?.find(
      (socket) => socket.room === room && socket.id === client.id,
    );
    if (!existingSocket) {
      this.activeSockets = [...this.activeSockets, { id: client.id, room }];
      client.emit(`${room}-update-user-list`, {
        users: this.activeSockets
          .filter((socket) => socket.room === room && socket.id !== client.id)
          .map((existingSocket) => existingSocket.id),
      });

      client.broadcast.emit(`${room}-update-user-list`, {
        users: [client.id],
        chat,
      });
    }

    return this.logger.log(
      `클라이언트 ${client.id}가 방에 조인했습니다. ${room}`,
    );
  }

  @SubscribeMessage('make-answer')
  public makeAnswer(client: Socket, data: any): void {
    client.to(data.to).emit('answer-maed', {
      socket: client.id,
      answer: data.answer,
    });
  }

  @SubscribeMessage('reject-call')
  public rejectCall(client: Socket, data: any): void {
    client.to(data.from).emit('call-rejected', {
      socket: client.id,
    });
  }

  afterInit(server: Server): void {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket): void {
    const existingSocket = this.activeSockets.find(
      (socket) => socket.id === client.id,
    );
    if (!existingSocket) return;

    this.activeSockets = this.activeSockets.filter(
      (socket) => socket.id !== client.id,
    );
    client.broadcast.emit(`${existingSocket.room}-remove-user`, {
      socketId: client.id,
    });

    this.logger.log(`클라이언트 연결끊김: ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`클라이언트 연결됨: ${client}`);
  }
}
