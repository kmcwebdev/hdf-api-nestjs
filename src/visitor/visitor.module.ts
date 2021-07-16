import { Module } from '@nestjs/common';
import { PrismaClientModule } from '../prisma-client/prisma-client.module';
import { GuestController } from './controller/guest.controller';
import { MemberController } from './controller/member.controller';
import { VisitorController } from './controller/visitor.controller';
import { GuestService } from './service/guest.service';
import { MemberService } from './service/member.service';
import { VisitorService } from './service/visitor.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [VisitorController, GuestController, MemberController],
  providers: [VisitorService, GuestService, MemberService],
})
export class VisitorModule {}
