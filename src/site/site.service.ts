import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class SiteService {
  constructor(
    private prismaClientService: PrismaClientService,
    private httpService: HttpService,
  ) {}

  erpSites<T>(pageSize = 100): Observable<T> {
    return this.httpService
      .get('/api/Buildings', {
        params: {
          pageSize,
        },
      })
      .pipe(
        map((resp) => resp.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  erpSiteFloors<T>(): Observable<T> {
    return this.httpService.get('/api/Buildings/floors').pipe(
      map((resp) => resp.data),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }

  async syncFloorToSites() {
    const erpSiteFloors = this.erpSiteFloors<{
      floors: [{ floorID: number; name: string; buildingID: number }];
    }>();

    const { floors } = await firstValueFrom(erpSiteFloors);

    floors.forEach(
      async (data: { floorID: number; name: string; buildingID: number }) => {
        console.log(data);
        await this.prismaClientService.floor.upsert({
          create: {
            floorId: data.floorID,
            floor: data.name.toUpperCase(),
            sites: { connect: [{ siteId: data.buildingID }] },
          },
          update: {
            floor: data.name.toUpperCase(),
            sites: { connect: [{ siteId: data.buildingID }] },
          },
          where: { floorId: data.floorID },
        });
      },
    );
  }

  @Cron(CronExpression.EVERY_WEEK)
  async syncSite(totalRecordCount: number) {
    const sites = this.erpSites<{
      data: [{ buildingID: number; name: string; email: string }];
    }>(totalRecordCount);

    const { data } = await firstValueFrom(sites);

    data.forEach(
      async (data: { buildingID: number; name: string; email: string }) => {
        await this.prismaClientService.site.upsert({
          create: {
            siteId: data.buildingID,
            siteName: data.name.toUpperCase(),
            siteEmail: data.email,
          },
          update: {
            siteName: data.name.toUpperCase(),
          },
          where: { siteId: data.buildingID },
        });
      },
    );

    await this.syncFloorToSites();

    return {
      message: 'Sync successfully',
      dateTime: new Date(),
      httpCode: 200,
    };
  }

  async getSites() {
    return await this.prismaClientService.site.findMany({
      orderBy: { siteId: 'asc' },
    });
  }

  async getFloors(siteId: number) {
    return await this.prismaClientService.floor.findMany({
      where: { sites: { some: { siteId } } },
      select: { floorId: true, floor: true },
      orderBy: { floorId: 'asc' },
    });
  }
}
