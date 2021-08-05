import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MiscService } from './misc.service';

@ApiTags('Misc')
@Controller('misc')
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Get('leave-types')
  @ApiOkResponse({ description: 'Success' })
  getSites() {
    return this.miscService.getLeaveTypes();
  }
}
