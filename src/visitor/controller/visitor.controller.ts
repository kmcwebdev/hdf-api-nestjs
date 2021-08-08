import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { EmailQuery } from 'src/user/query/email.query';
import { CreateSubEmailsDTO } from 'src/visitor/dto/visitor/create-sub-emails.dto';
import { PTVisitQuery } from '../query/visit.query';
import { VisitorService } from '../service/visitor.service';

@ApiTags('Visitor')
@Controller('visitors')
export class VisitorController {
  constructor(private visitorService: VisitorService) {}

  @Get('visits')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: PTVisitQuery, required: false })
  @ApiOkResponse({ description: 'Success' })
  getVisits(@Query() query: PTVisitQuery) {
    return this.visitorService.getVisits(query);
  }

  @Get('visits/:visitId')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'visitId', description: 'Visit id' })
  @ApiOkResponse({ description: 'Success' })
  getVisit(@Param('visitId', new ParseIntPipe()) visitId: number) {
    return this.visitorService.getVisit(visitId);
  }

  @Post('check-email')
  @HttpCode(200)
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

  @Post('sub-emails')
  @ApiBody({ type: CreateSubEmailsDTO })
  @ApiCreatedResponse({ description: 'Created' })
  createVisitorSubEmails(@Body() data: CreateSubEmailsDTO) {
    return this.visitorService.createVisitorSubEmails(data);
  }

  @Patch('clear')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  clearVisitor(@Req() req: Request, @Query() { email }: EmailQuery) {
    return this.visitorService.clearVisitor({ userId: req.user.id, email });
  }
}
