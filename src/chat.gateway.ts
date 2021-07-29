import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Socket;

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);

    return this.server.emit('joined-room', room);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(room);

    return this.server.emit('left-room', room);
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() payload: { content: string; room: string; sender: string },
  ) {
    const { room } = payload;

    return this.server.to(room).emit('send-message', payload);
  }
}
