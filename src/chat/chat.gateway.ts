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
import { ChannelMember } from 'src/typeorm/entities/ChannelMember';
import { ChannelRepository } from 'src/typeorm/repository/channel.repository';
import { ChatRepository } from 'src/typeorm/repository/chat.repository';
import { MemberRepository } from 'src/typeorm/repository/member.repository';
import { ChatService } from './chat.service';

interface newRooom {
  roomName: string;
  roomDep: string;
  roomUrl: string;
}
// roomName: location.state.roomName,
// roomDep: location.state.roomDep,
// roomUrl: window.location.href,
@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private activeSockets: { roomID: string; id: string }[] = [];
  // private chat: { room: any };
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly chatRepository: ChatRepository,
    private readonly memberRepository: MemberRepository,
    private readonly chatService: ChatService,
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

  //   @UseGuards(JwtAuthGuard)
  @SubscribeMessage('join')
  public async joinRoom(
    client: Socket,
    room: { newRoom: newRooom; userId: number },
  ) {
    client.emit('joinRoom', room);

    const rooom = await this.channelRepository.findOne({
      name: room[0].roomName,
      host_id: room[1],
    });
    if (!rooom) {
      //   this.chatService.createChannel();
      const newRooom = new Channel();
      newRooom.name = room[0].roomName;
      newRooom.dep = room[0].roomDep;
      newRooom.url = room[0].roomUrl;
      newRooom.host_id = room[1];
      await this.channelRepository.save(newRooom);

      const newMember = new ChannelMember();
      newMember.user_id = room[1];
      newMember.channel_id = newRooom.id;
      await this.memberRepository.save(newMember);
    } else {
      const preMember = await this.memberRepository.findOne({
        channel_id: rooom.id,
        user_id: room[1],
      });
      if (!preMember) {
        const newMember = new ChannelMember();
        newMember.user_id = room[1];
        newMember.channel_id = rooom.id;
        await this.memberRepository.save(newMember);
      }
    }

    console.log('room', room[0]);
  }

  //서버
  // @SubscribeMessage('join')
  // // @UseGuards(JwtAuthGuard)
  // public async joinRoom(client: Socket, @MessageBody() room:{roomID:string,roomName:string,roomDep:string}): Promise<void> {
  //   const chat = await this.chatRepository.find({ channel_id: room.roomID });
  //   this.logger.log('룸아이디',room.roomID);

  //   // const channel = new Channel();
  //   // channel.name = room;
  //   // channel.host = userId;

  //   const existingSocket = this.activeSockets?.find(
  //     (socket) => socket.roomID === room.roomID && socket.id === client.id,
  //   );
  //   if (!existingSocket) {
  //     this.activeSockets = [...this.activeSockets, { id: client.id, roomID:room.roomID }];
  //     client.emit('roomCreate',room ,{

  //         users: this.activeSockets
  //         .filter((socket) => socket.roomID === room.roomID && socket.id !== client.id)
  //         .map((existingSocket) => existingSocket.id),

  //     });

  //     client.broadcast.emit(`${room}-update-user-list`, {
  //       users: [client.id],
  //       chat,
  //     });
  //   }

  //   return this.logger.log(
  //     `클라이언트 ${client.id}가 방에 조인했습니다. ${room}`,
  //   );
  // }

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
    client.broadcast.emit(`${existingSocket.roomID}-remove-user`, {
      socketId: client.id,
    });

    this.logger.log(`클라이언트 연결끊김: ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`클라이언트 연결됨: ${client.id}`);
  }
}
