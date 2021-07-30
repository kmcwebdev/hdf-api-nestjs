import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { EventVisitGatewayIDTO } from 'src/common/interface/event-visit-gateway/event-visit-gateway.interface';

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
