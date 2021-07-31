import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { EventVisitGatewayIDTO } from 'src/visit-event-gateway/interface/event-visit-gateway.interface';

@WebSocketGateway()
export class VisitEventGateway {
  @WebSocketServer() server: Socket;

  @SubscribeMessage('visit-event')
  onEvent(
    @MessageBody() payload: EventVisitGatewayIDTO,
  ): Observable<WsResponse<EventVisitGatewayIDTO>> {
    const event = 'visit-event';

    return from([payload]).pipe(map((data) => ({ event, data })));
  }
}
