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
import { CreateTemperatureDTO } from '../dto/create-temperature.dto';
import { CurrentVisitQuery } from '../query/current-visit.query';
import { PTTemperatureChecklistQuery } from '../query/temperature-checlist.query';
import { PTVisitHistoryQuery } from '../query/visit-history.query';
import { PTVisitQuery } from '../query/visit.query';
import { PTVisitorNoteQuery } from '../query/visitor-note.query';
import { VisitorService } from '../service/visitor.service';

@ApiTags('Visitor')
@Controller('visitors')
export class VisitorController {
  constructor(private visitorService: VisitorService) {}

  @Get('visits')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: PTVisitQuery, required: false })
  @ApiOkResponse({ description: 'Success' })
  getVisits(@Req() req: Request, @Query() query: PTVisitQuery) {
    return this.visitorService.getVisits(req.user, query);
  }

  @Get('visits/history')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: PTVisitHistoryQuery, required: false })
  @ApiOkResponse({ description: 'Success' })
  getVisitsHistory(@Query() query: PTVisitHistoryQuery) {
    return this.visitorService.getVisitsHistory(query);
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

  @Patch('blocked')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'visitorId', description: 'Visitor id' })
  @ApiOkResponse({ description: 'Success' })
  blockVisitor(@Query('visitorId', new ParseIntPipe()) visitorId: number) {
    return this.visitorService.blockVisitor(visitorId);
  }

  @Patch('unblocked')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'visitorId', description: 'Visitor id' })
  @ApiOkResponse({ description: 'Success' })
  unblockVisitor(@Query('visitorId', new ParseIntPipe()) visitorId: number) {
    return this.visitorService.unblockVisitor(visitorId);
  }

  @Get('notes')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ type: PTVisitorNoteQuery, required: false })
  @ApiOkResponse({ description: 'Success' })
  getVisitorNotes(@Query() query: PTVisitorNoteQuery) {
    return this.visitorService.getVisitorNotes(query);
  }

  @Post('notes')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'visitorId', description: 'Visitor id' })
  @ApiCreatedResponse({ description: 'Created' })
  createVisitorNote(
    @Req() req: Request,
    @Query('visitorId', new ParseIntPipe()) visitorId: number,
    @Body() { note }: CreateVisitorNoteDTO,
  ) {
    return this.visitorService.createVisitorNote({
      visitorId,
      authorId: req.user.id,
      note,
    });
  }

  @Get('temperatures')
  @ApiQuery({ type: PTTemperatureChecklistQuery, required: false })
  @ApiOkResponse({ description: 'Success' })
  getUsers(@Query() query: PTTemperatureChecklistQuery) {
    return this.visitorService.getTemperatureChecklist(query);
  }

  @Post('temperatures')
  @ApiQuery({ name: 'visitorId', description: 'Visitor id' })
  @ApiCreatedResponse({ description: 'Created' })
  addTemperature(
    @Query('visitorId', new ParseIntPipe()) visitorId: number,
    @Body() { temperature }: CreateTemperatureDTO,
  ) {
    return this.visitorService.addTemperature({ visitorId, temperature });
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
