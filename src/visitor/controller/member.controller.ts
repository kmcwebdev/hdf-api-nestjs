import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateMemberVisitorDTO } from 'src/visitor/dto/visitor/member/create-member-visit.dto';
import { MemberService } from '../service/member.service';

@ApiTags('Member')
@Controller('visitors')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post('members')
  @ApiBody({ type: CreateMemberVisitorDTO })
  @ApiCreatedResponse({ description: 'Created' })
  createMemberVisitor(@Body() data: CreateMemberVisitorDTO) {
    return this.memberService.createMemberVisitor(data);
  }
}
