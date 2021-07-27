import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { EmailQuery } from 'src/common/query/email.query';
import { AzureGraphApiService } from './azure-graph-api.service';

@ApiTags('Azure graph')
@Controller('azure-graph')
@UseGuards(JwtAuthGuard)
export class AzureGraphApiController {
  constructor(private readonly azureGraphApiService: AzureGraphApiService) {}

  @Get('email-details')
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  getEmailDetails(@Query() { email }: EmailQuery) {
    return this.azureGraphApiService.getEmailDetails(email);
  }
}
