import {
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { SiteTotalRecordCountDTO } from 'src/site/dto/site-total-record-count.dto';
import { SiteService } from './site.service';

@ApiTags('Site')
@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get()
  @ApiOkResponse({ description: 'Success' })
  getSites() {
    return this.siteService.getSites();
  }

  @Get('floors')
  @ApiQuery({ name: 'siteId' })
  @ApiOkResponse({ description: 'Success' })
  getFloors(@Query('siteId', ParseIntPipe) siteId: number) {
    return this.siteService.getFloors(siteId);
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiQuery({ type: SiteTotalRecordCountDTO })
  @ApiOkResponse({ description: 'Success' })
  syncSite(@Query() { totalRecordCount }: SiteTotalRecordCountDTO) {
    return this.siteService.syncSite(totalRecordCount);
  }
}
