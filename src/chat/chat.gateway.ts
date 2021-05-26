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


interface newRooom {
  roomName: string;
  roomDep: string;
  roomUrl: string;
}


@WebSocketGateway({namespace:'/chat'})

export class ChatGateway
  implements OnGatewayInit{ //어제 한다고 주석친다고 임플린먼츠 좀 지우고 했어요
  @WebSocketServer() server: Server;
  private activeSockets: { roomID: string; id: string }[] = [];
  
  // private chat: { room: any };
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly chatRepository: ChatRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  // connectedUsers: string[] = [];

  @SubscribeMessage('msgToServer')
  handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const [roomUrl, userName, msg] = data;
    console.log('dater',data)
    console.log('room url',roomUrl)
    return this.server.to(roomUrl).emit('msgToClient', data);
  }
  // @SubscribeMessage('join')
  // joinRoom(client: Socket, room: { newRoom: newRooom; userID: number },) {
  //   client.join(room[0].roomUrl);
  //   client.emit('joinRoom', room.userID);
  // }

 @SubscribeMessage('join')
  public async joinRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
    // client: Socket,
    // room: { newRoom: newRooom; userID: number },
 

  ) {
   
    const [roomName, roomDep, roomUrl, id] = data;
    console.log('data',data)
    console.log('data[0]',data[0])
    console.log('data.id',id)
    client.join(roomUrl);
    client.to(roomUrl).broadcast.emit('joinRoom', id);
  
    // this.channelRepository
    //   .findOne({
    //     url: room[0].roomUrl,
    //   })
    //   .then(async (rooom) => {
    //     if (!rooom) {
    //       //   this.chatService.createChannel();
    //       const newRooom = new Channel();
    //       newRooom.name = room[0].roomName;
    //       newRooom.dep = room[0].roomDep;
    //       newRooom.url = room[0].roomUrl;
    //       newRooom.host_id = room[1];
    //       await this.channelRepository.save(newRooom);

    //       const newMember = new ChannelMember();
    //       newMember.user_id = room[1];
    //       newMember.channel_id = newRooom.id;
    //       await this.memberRepository.save(newMember);
    //     } else {
    //       const preMember = await this.memberRepository.findOne({
    //         channel_id: rooom.id,
    //         user_id: room[1],
    //       });
    //       if (!preMember) {
    //         const newMember = new ChannelMember();
    //         newMember.user_id = room[1];
    //         newMember.channel_id = rooom.id;
    //         await this.memberRepository.save(newMember);
    //       }
    //     }
    //   }).catch((error)=>{
    //     console.log(error);
    //   });
  }
  


  afterInit(server: Server): void {
    this.logger.log('Init');
  }

  // handleDisconnect(client: Socket): void {
  //   this.logger.log(`클라이언트 연결끊김: ${client.id}`);
  // }
  // handleConnection(client: Socket, ...args: any[]) {
  //   this.logger.log(`클라이언트 연결됨: ${client.id}`);
  //   // console.log(client);
  // }
}
