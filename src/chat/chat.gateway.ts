import { Length } from 'class-validator';
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

import wrtc from 'wrtc';

interface newRooom {
  roomName: string;
  roomDep: string;
  roomUrl: string;
}

interface msgPayload {
  name: string;
  text: string;
  room: string;
}
interface IUser{
  nickname: string;
};
// roomName: location.state.roomName,
// roomDep: location.state.roomDep,
// roomUrl: window.location.href,
@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  ////////////
  receiverPCs = {};
  senderPCs = {};
  users:any = {};
  // onlineUsers:{[socketID:string]:{members:object}}={};
  onlineUsers:{[userID:number]:{userID:number,userName:string,socketID:string}}={};
  socketToRoom = {};
  objID=[];

  pc_config = {
    iceServers: [
      // {
      //   urls: 'stun:[STUN_IP]:[PORT]',
      //   'credentials': '[YOR CREDENTIALS]',
      //   'username': '[USERNAME]'
      // },
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  };
  isIncluded = (array, id) => {
    const len = array.length;
    for (let i = 0; i < len; i++) {
      if (array[i].id === id) return true;
    }
    return false;
  };

  createReceiverPeerConnection = (socketID, socket, roomID) => {
    const pc = new wrtc.RTCPeerConnection(this.pc_config);

    if (this.receiverPCs[socketID]) this.receiverPCs[socketID] = pc;
    else this.receiverPCs = { ...this.receiverPCs, [socketID]: pc };

    pc.onicecandidate = (e) => {
      //console.log(`socketID: ${socketID}'s receiverPeerConnection icecandidate`);
      socket.to(socketID).emit('getSenderCandidate', {
        candidate: e.candidate,
      });
    };

    pc.oniceconnectionstatechange = (e) => {
      //console.log(e);
    };

    pc.ontrack = (e) => {
      if (this.users[roomID]) {
        if (!this.isIncluded(this.users[roomID], socketID)) {
          this.users[roomID].push({
            id: socketID,
            stream: e.streams[0],
          });
        } else return;
      } else {
        this.users[roomID] = [
          {
            id: socketID,
            stream: e.streams[0],
          },
        ];
      }
      socket.broadcast.to(roomID).emit('userEnter', { id: socketID });
    };

    return pc;
  };

  createSenderPeerConnection = (
    receiverSocketID,
    senderSocketID,
    socket,
    roomID,
  ) => {
    const pc = new wrtc.RTCPeerConnection(this.pc_config);

    if (this.senderPCs[senderSocketID]) {
      this.senderPCs[senderSocketID].filter(
        (user) => user.id !== receiverSocketID,
      );
      this.senderPCs[senderSocketID].push({ id: receiverSocketID, pc: pc });
    } else
      this.senderPCs = {
        ...this.senderPCs,
        [senderSocketID]: [{ id: receiverSocketID, pc: pc }],
      };

    pc.onicecandidate = (e) => {
      //console.log(`socketID: ${receiverSocketID}'s senderPeerConnection icecandidate`);
      socket.to(receiverSocketID).emit('getReceiverCandidate', {
        id: senderSocketID,
        candidate: e.candidate,
      });
    };

    pc.oniceconnectionstatechange = (e) => {
      //console.log(e);
    };

    const sendUser = this.users[roomID].filter(
      (user) => user.id === senderSocketID,
    );
    sendUser[0].stream.getTracks().forEach((track) => {
      pc.addTrack(track, sendUser[0].stream);
    });

    return pc;
  };

  getOtherUsersInRoom = (socketID, roomID) => {
    console.log(socketID)
    const allUsers = [];
   
 
    console.log("what?",this.users)
    if (!this.users[roomID]) return allUsers;

    const len = this.users.length;

    for (let i = 0; i < len; i++) {
      if (this.users[roomID][i].id === socketID) continue;
     console.log('whatttttt',allUsers.push(this.users));
    }

    return allUsers;
  };
  

  // getOnlineMember=(socketID,userID,userName)=>{
  //   console.log(`${socketID},${userID},${userName}`)
  //     let allMembers={
  //         userID:userID,
  //         userName:userName
  //     }
  //     this.onlineUsers[socketID]=allMembers
  //    console.log(this.onlineUsers);
  //     if(!this.onlineUsers) return allMembers
     
  //      console.log("same", this.onlineUsers)
     
  //     console.log('함 보자!',allMembers);
  //     return this.onlineUsers;
  // }

  getOnlineMember=(socketID:string,userID:number,userName:string)=>{
    console.log(`${socketID},${userID},${userName}`)
     let allMember={
       userID:userID,
       userName:userName,
       socketID:socketID

     }
     
     let memberIDs;

      // if(!this.users[userID]) return memberIDs;

      // let len =this.users[userID].length;
      // for(let i=0; i<len; i++){
      //   if(this.users[userID][i].id===socketID) continue;
      //   memberIDs.push({id:this.users[userID][i].id})
      // }
 
     this.onlineUsers[userID]={userID:userID,userName:userName,socketID:socketID};

     console.log('what the?',allMember)
     console.log('what the?2222',Object.values(this.onlineUsers))
    //  memberIDs.push(Object.keys(this.onlineUsers))
    memberIDs=Object.values(this.onlineUsers);
     
   

  //    for(const [key,value] of Object.entries(this.onlineUsers)){
     
  //     console.log(`wwww ${key} : ${Object.values(value)} }`)
     
      
      

  //  } 
    return memberIDs;
    // return Object.keys(this.onlineUsers);
      
  }

  

  deleteUser = (socketID, roomID) => {
    console.log(`test ${socketID} ${roomID}`)
    let roomUsers = this.users[roomID];
    if (!roomUsers) return;
    roomUsers = roomUsers.filter((user) => user.id !== socketID);
    this.users[roomID] = roomUsers;
    if (roomUsers.length === 0) {
      delete this.users[roomID];
    }
    delete this.socketToRoom[socketID];
  };

  deleteUser2 = (socketID, roomID) => {
    console.log(`test ${socketID} ${roomID}`)
    let roomUsers =Object.values(this.onlineUsers).map(user=>user);
    if (!roomUsers) return;
    roomUsers = roomUsers.filter((user) => user.userID !== socketID);
    this.users[roomID] = roomUsers;
    if (roomUsers.length === 0) {
      delete this.users[roomID];
    }
    delete this.socketToRoom[socketID];
  };

  closeRecevierPC = (socketID) => {
    if (!this.receiverPCs[socketID]) return;

    this.receiverPCs[socketID].close();
    delete this.receiverPCs[socketID];
  };

  closeSenderPCs = (socketID) => {
    if (!this.senderPCs[socketID]) return;

    const len = this.senderPCs[socketID].length;
    for (let i = 0; i < len; i++) {
      this.senderPCs[socketID][i].pc.close();
      const _senderPCs = this.senderPCs[this.senderPCs[socketID][i].id];
      const senderPC = _senderPCs.filter((sPC) => sPC.id === socketID);
      if (senderPC[0]) {
        senderPC[0].pc.close();
        this.senderPCs[this.senderPCs[socketID][i].id] = _senderPCs.filter(
          (sPC) => sPC.id !== socketID,
        );
      }
    }

    delete this.senderPCs[socketID];
  };

  ///////
  private activeSockets: { roomID: string; id: string }[] = [];
  public rooms: Map<string, IUser> = new Map();

  public workers: {
    [index: number]: {
      clientsCount: number;
      roomsCount: number;
      pid: number;
      worker: Worker;
    };
  };
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly chatRepository: ChatRepository,
    private readonly memberRepository: MemberRepository,
    private readonly chatService: ChatService,
  ) {}

  //   connectedUsers: string[] = [];
  @SubscribeMessage('msgToServer')
  handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const [roomUrl, userName, msg,userEmail] = data;
    console.log('dater',data)
    console.log('room url',roomUrl)
    return this.server.to(roomUrl).emit('msgToClient', data);
  }

  ////sfu 붙이기
  @SubscribeMessage('senderOffer')
  async senderOffer(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const [senderSocketID, roomID, sdpp] = data;

    try {
      this.socketToRoom[senderSocketID] = roomID;
      const pc = this.createReceiverPeerConnection(
        senderSocketID,
        client,
        roomID,
      );
      await pc.setRemoteDescription(sdpp);
      const sdp = await pc.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(sdp);
      client.join(roomID);
      this.server.to(senderSocketID).emit('getSenderAnswer', { sdp });
    } catch (error) {}
  }

  @SubscribeMessage('senderCandidate')
  async senderCandidate(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const [senderSocketID, candidate] = data;
    try {
      const pc = this.receiverPCs[senderSocketID];
      await pc.addIceCandidate(new wrtc.RTCIceCandidate(candidate));
    } catch (error) {
      console.log(error);
    }
  }
  @SubscribeMessage('receiverOffer')
  async receiverOffer(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const [receiverSocketID, senderSocketID, roomID, sdpp] = data;
    try {
      const pc = this.createSenderPeerConnection(
        receiverSocketID,
        senderSocketID,
        client,
        roomID,
      );
      await pc.setRemoteDescription(sdpp);
      const sdp = await pc.createAnswer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      await pc.setLocalDescription(sdp);
      this.server.to(receiverSocketID).emit('getReceiverAnswer', {
        id: senderSocketID,
        sdp,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('receiverCandidate')
  async receiverCandidate(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const [senderSocketID, receiverSocketID, candidate] = data;
    try {
      const senderPC = this.senderPCs[senderSocketID].filter(
        (sPC) => sPC.id === receiverSocketID,
      );
      await senderPC[0].pc.addIceCandidate(new wrtc.RTCIceCandidate(candidate));
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('onlineList')
   async handleOnline(   
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket){

    const [userID,username] = data;
  
    const user={
      id:client.id,
      name:data[1],
      userID:data[0]
    }
    // this.users[client.id]=user

    console.log('유저온라인입니다ID',data[0])
    console.log('유저온라인입니다UserName',data[1])

     console.log(`A User ${user.name} Connect!`)

     try{
       let allMembers=this.getOnlineMember(client.id,userID,username)
       console.log('fdsfsfs',allMembers);
       client.emit('getOnline',allMembers);
     }catch(error){
      console.log(error);
     }
    
    //  client.emit('getOnline',this.users)
  
  }

  // @SubscribeMessage('joinRoom')
  // joinRoom2(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
  //   const [id, roomID] = data;
  //   try {
  //     const allUsers = this.getOtherUsersInRoom(id, roomID,);
  //     client.to(id).emit('allUsers', { users: allUsers });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  ///기존코드
  @SubscribeMessage('join')
  public async joinRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,

  ) {
    
  
    const [roomName, roomDep, roomUrl, userID,username,userEmail,roomID] = data;
    const user={
      userEmail:userEmail,
      userName:username,
      userID:userID,
      socketID:client.id
    }
    this.users[client.id]=user

    console.log('data',data)
    console.log('data[0]',data[0])
    console.log('data[4]',data[4])
    console.log('data.id',userID)
    console.log('유저들아욌디',user)
    client.join(roomUrl);
    
    
    client.join(roomUrl);
    client.emit('joinRoom', Object.values(this.users));
  
    await this.channelRepository
      .findOne({
        url: data[2],
      })
      .then(async (room) => {
        if (!room) {
          //   this.chatService.createChannel();
          const newRooom = new Channel();
          newRooom.name = data[0];
          newRooom.dep = data[1];
          newRooom.url = data[2];
          newRooom.host_id = data[3];
          await this.channelRepository.save(newRooom);

          const newMember = new ChannelMember();
          newMember.user_id = data[3];
          newMember.channel_id = newRooom.id;
          await this.memberRepository.save(newMember);
        } else {
          const preMember = await this.memberRepository.findOne({
            channel_id: room.id,
            user_id: data[3],
          });
          if (!preMember) {
            const newMember = new ChannelMember();
            newMember.user_id = data[3];
            newMember.channel_id = room.id;
            await this.memberRepository.save(newMember);
          }
        }
      }).catch((error)=>{
        console.log(error);
      });
  }

  
  afterInit(server: Server): void {
    this.logger.log('Init');
  }

  // // sfu 추가
  // handleDisconnect(client: Socket): void {
  //   try {
  //     console.log('hhhhhhhh',this.onlineUsers)
  //     const roomID = this.socketToRoom[client.id];
      

  //     this.deleteUser(client.id, roomID);
  //     this.closeRecevierPC(client.id);
  //     this.closeSenderPCs(client.id);

  //     client.broadcast.to(roomID).emit('userExit', { id: client.id });
  //   } catch (error) {
  //     console.log(error);
  //   }   
  //   this.logger.log(`클라이언트 연결끊김: ${client.id}`);
 

 
  // }

    //기존
    handleDisconnect(client: Socket):void {
      console.log('ddddf',Object.values(this.onlineUsers))
          try {
      console.log('hhhhhhhh',this.onlineUsers)
     delete this.users[client.id]
     this.server.emit('userDisconnect',client.id)

    } catch (error) {
      console.log(error);
    } 
      this.logger.log(`클라이언트 연결끊김: ${client.id}`);




    }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`클라이언트 연결됨: ${client.id}`);
  }
}