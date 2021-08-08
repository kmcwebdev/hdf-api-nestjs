import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { FilterConfigService } from './filter-config.service';

@ApiTags('Filter configuration')
@Controller('filter-config')
@UseGuards(JwtAuthGuard)
export class FilterConfigController {
  constructor(private readonly filterConfigService: FilterConfigService) {}

  @Get('sites')
  @ApiOkResponse({ description: 'Success' })
  getSites(@Req() req: Request) {
    return this.filterConfigService.getUserAllowedSiteFilters(req.user.id);
  }
}
