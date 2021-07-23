import { Controller, Get, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
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

  @Get('last-visit')
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  checkLastVisitorVisitStatus(@Query() { email }: EmailQuery) {
    return this.visitorService.checkLastVisitorVisitStatus({
      email,
      modeOfUse: 'Check',
    });
  }

  @Patch('clear')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  clearVisitor(@Req() req: Request, @Query() { email }: EmailQuery) {
    return this.visitorService.clearVisitor({ userId: req.user.id, email });
  }
}
