import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateGuestVisitorDTO } from 'src/visitor/dto/visitor/guest/create-guest-visitor.dto';
import { GuestService } from '../service/guest.service';

@ApiTags('Guest')
@Controller('visitors')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @Post('guests')
  @ApiBody({ type: CreateGuestVisitorDTO })
  @ApiCreatedResponse({ description: 'Created' })
  createGuestVisitor(@Body() data: CreateGuestVisitorDTO) {
    return this.guestService.createGuestVisitor(data);
  }
}
