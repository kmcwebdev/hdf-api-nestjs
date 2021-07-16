import { Controller } from '@nestjs/common';
import { MemberService } from '../service/member.service';

@Controller('visitors')
export class MemberController {
  constructor(private memberService: MemberService) {}
}
