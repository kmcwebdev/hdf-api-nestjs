import { Module } from '@nestjs/common';
import { VisitEventGateway } from './visit-event-gateway.service';

@Module({
  providers: [VisitEventGateway],
})
export class VisitEventGatewayModule {}
