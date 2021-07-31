import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { EmailQuery } from 'src/user/query/email.query';
import { AzureGraphService } from './azure-graph.service';

@ApiTags('Azure graph')
@Controller('azure-graph')
@UseGuards(JwtAuthGuard)
export class AzureGraphController {
  constructor(private readonly azureGraphApiService: AzureGraphService) {}

  @Get('email-details')
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  getEmailDetails(@Query() { email }: EmailQuery) {
    return this.azureGraphApiService.getEmailDetails(email);
  }
}
