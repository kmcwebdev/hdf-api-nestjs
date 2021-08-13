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
import { CreateVisitorNoteDTO } from 'src/user/dto/create-visitor-note.dto';
import { EmailQuery } from 'src/user/query/email.query';
import { CreateSubEmailsDTO } from 'src/visitor/dto/visitor/create-sub-emails.dto';
import { CurrentVisitQuery } from '../query/current-visit.query';
import { PTVisitHistoryQuery } from '../query/visit-history.query';
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

  @Get('visits/histories')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: PTVisitHistoryQuery, required: false })
  @ApiOkResponse({ description: 'Success' })
  getVisitHistories(@Query() query: PTVisitHistoryQuery) {
    return this.visitorService.getVisitHistories(query);
  }

  @Get('visits/current')
  @ApiQuery({ type: CurrentVisitQuery })
  @ApiOkResponse({ description: 'Success' })
  getVisitorCurrentVisit(@Query() { visitId }: CurrentVisitQuery) {
    return this.visitorService.getVisitorCurrentVisit(visitId);
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

  @Post('sub-emails')
  @ApiBody({ type: CreateSubEmailsDTO })
  @ApiCreatedResponse({ description: 'Created' })
  createVisitorSubEmails(@Body() data: CreateSubEmailsDTO) {
    return this.visitorService.createVisitorSubEmails(data);
  }

  @Post('notes')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'userId', description: 'User id' })
  @ApiCreatedResponse({ description: 'Created' })
  createVisitorNote(
    @Req() req: Request,
    @Query('userId', new ParseIntPipe()) userId: number,
    @Body() { note }: CreateVisitorNoteDTO,
  ) {
    return this.visitorService.createVisitorNote({
      userId,
      authorId: req.user.id,
      note,
    });
  }

  @Patch('clear')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  clearVisitor(
    @Req() req: Request,
    @Query() { email }: EmailQuery,
    @Body() { note }: CreateVisitorNoteDTO,
  ) {
    return this.visitorService.clearVisitor({
      userId: req.user.id,
      email,
      note,
    });
  }
}
