import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmailQuery } from 'src/common/query/email.query';
import { VisitorService } from '../service/visitor.service';

@ApiTags('Visitor')
@Controller('visitors')
export class VisitorController {
  constructor(private visitorService: VisitorService) {}

  @Get('check-email')
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  checkVisitorEmail(@Query() { email }: EmailQuery) {
    return this.visitorService.checkVisitorEmail(email);
  }
}
