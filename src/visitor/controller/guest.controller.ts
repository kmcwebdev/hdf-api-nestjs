import { Controller } from '@nestjs/common';
import { GuestService } from '../service/guest.service';

@Controller('visitors')
export class GuestController {
  constructor(private guestService: GuestService) {}
}
