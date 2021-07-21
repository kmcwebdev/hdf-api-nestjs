import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGuestVisitorDTO } from 'src/common/dto/visitor/guest/create-guest-visitor.dto';
import { GuestService } from '../service/guest.service';

@ApiTags('Guest')
@Controller('visitors')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @Post('guests')
  createGuestVisitor(@Body() data: CreateGuestVisitorDTO) {
    return this.guestService.createGuestVisitor(data);
  }
}
