import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Visitor } from '@prisma/client';
import { currentDate } from 'src/common/utils/current-date.util';
import { paginate } from 'src/common/utils/paginate.util';
import { MailService } from 'src/mail/mail.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { User } from 'src/user/entity/user.entity';
import { UserType } from 'src/user/enum/user-type.enum';
import { CreateSubEmailsDTO } from 'src/visitor/dto/visitor/create-sub-emails.dto';
import { CreateVisitorDTO } from 'src/visitor/dto/visitor/create-visitor.dto';
import { QuestionDTO } from '../dto/visitor/question.dto';
import { PTTemperatureChecklistQuery } from '../query/temperature-checklist.query';
import { PTVisitHistoryQuery } from '../query/visit-history.query';
import { PTVisitQuery } from '../query/visit.query';
import { PTVisitorNoteQuery } from '../query/visitor-note.query';

@Injectable()
export class VisitorService {
  private dhClearanceStatus: string;
  private currentDate: Date;

  constructor(
    private prismaClientService: PrismaClientService,
    private mailService: MailService,
    private config: ConfigService<{
      sendGrid: { dhClearanceStatus: string };
      env: { mode: string };
    }>,
  ) {
    this.dhClearanceStatus = this.config.get<string>(
      'sendGrid.dhClearanceStatus',
      {
        infer: true,
      },
    );
    this.currentDate = currentDate();
  }

  async getVisits(user: User, query: PTVisitQuery) {
    const {
      firstName,
      lastName,
      email,
      guest,
      siteId,
      tag,
      status,
      dateFrom,
      dateTo,
    } = query;

    const { page, limit, skip } = paginate(query.page, query.limit);

    const entity = await this.prismaClientService.userDomainFilter.findFirst({
      where: { userId: user.id },
    });

    const location = await this.prismaClientService.userSiteFilter.findFirst({
      where: { userId: user.id },
      include: { sites: { orderBy: { siteId: 'asc' } } },
    });

    const sid = location.sites.find((x) => x.siteId === siteId)?.siteId;

    const where = {
      guest: { equals: guest },
      visitor: {
        firstName: { contains: firstName, mode: 'insensitive' },
        lastName: { contains: lastName, mode: 'insensitive' },
        email: {
          contains: email,
          endsWith: (entity?.domains.length && entity.domains[0]) || undefined,
          mode: 'insensitive',
        },
      },
      siteId: {
        equals:
          user.userType === UserType.Internal
            ? sid
              ? sid
              : undefined
            : location.sites.length && !sid
            ? location.sites[0].siteId
            : sid,
      },
      healthTag: { tag: { equals: tag } },
      visitorStatus: { status: { equals: status } },
      dateCreated: {
        gte: dateFrom ? new Date(dateFrom) : undefined,
        lte: dateTo ? new Date(dateTo) : undefined,
      },
    } as const;

    const result = await this.prismaClientService.$transaction([
      this.prismaClientService.visit.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          visitId: true,
          guest: true,
          visitor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
              company: true,
              address: true,
            },
          },
          site: {
            select: {
              siteName: true,
            },
          },
          floor: {
            select: {
              floor: true,
            },
          },
          workType: {
            select: {
              type: true,
            },
          },
          healthTag: {
            select: {
              tag: true,
            },
          },
          travelLocations: true,
          surveys: {
            select: {
              question: {
                select: {
                  question: true,
                },
              },
              answers: true,
            },
            orderBy: {
              id: 'asc',
            },
          },
          visitorStatus: {
            select: {
              status: true,
            },
          },
          dateCreated: true,
          timeCreated: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),
      this.prismaClientService.visit.count({
        where,
      }),
    ]);

    return {
      data: result[0],
      pagination: {
        page,
        limit,
        count: result[1],
      },
    };
  }

  async getVisit(visitId: number) {
    return await this.prismaClientService.visit.findUnique({
      where: { id: visitId },
      select: {
        id: true,
        visitId: true,
        guest: true,
        workType: true,
        leaveType: true,
        visitor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            company: true,
            address: true,
            isClear: true,
            isBlocked: true,
          },
        },
        site: {
          select: {
            siteName: true,
          },
        },
        floor: {
          select: {
            floor: true,
          },
        },
        healthTag: {
          select: {
            tag: true,
          },
        },
        visitorStatus: {
          select: {
            status: true,
          },
        },
        surveys: {
          select: {
            question: true,
            answers: true,
          },
        },
        poc: true,
        pocEmail: true,
        purposeOfVisit: true,
        dateCreated: true,
        timeCreated: true,
      },
    });
  }

  async getVisitsHistory(query: PTVisitHistoryQuery) {
    const { visitorId, siteId, dateFrom, dateTo, timeFrom, timeTo } = query;

    const { page, limit, skip } = paginate(query.page, query.limit);

    const where = {
      visitorId: {
        equals: visitorId,
      },
      siteId: {
        equals: siteId,
      },
      OR: [
        {
          workType: {
            type: {
              equals: 'On site',
            },
          },
        },
        {
          workTypeId: null,
        },
      ],
      dateCreated: {
        gte: dateFrom ? new Date(dateFrom) : undefined,
        lte: dateTo ? new Date(dateTo) : undefined,
      },
      timeCreated: {
        gte: timeFrom ? new Date(timeFrom) : undefined,
        lte: timeTo ? new Date(timeTo) : undefined,
      },
    };

    const result = await this.prismaClientService.$transaction([
      this.prismaClientService.visit.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          site: {
            select: {
              siteName: true,
            },
          },
          floor: {
            select: {
              floor: true,
            },
          },
          dateCreated: true,
          timeCreated: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),
      this.prismaClientService.visit.count({
        where,
      }),
    ]);

    return {
      data: result[0],
      pagination: {
        page,
        limit,
        count: result[1],
      },
    };
  }

  async getOrCreateVisitor(data: CreateVisitorDTO) {
    const { email } = data;

    let visitor: Visitor;

    const getVisitor = await this.checkVisitorEmail(email);

    if (getVisitor) {
      visitor = getVisitor;
    }

    if (!getVisitor) {
      const createdVisitor = await this.prismaClientService.visitor.create({
        data,
      });

      visitor = createdVisitor;
    }

    return visitor;
  }

  async checkDuplicateVisit(data: {
    siteId: number;
    visitorId: number;
    isGuest: boolean;
  }) {
    const { siteId, visitorId, isGuest } = data;

    const duplicateVisit = await this.prismaClientService.visit.findFirst({
      where: {
        AND: [
          {
            guest: { equals: isGuest },
          },
          {
            siteId: { equals: siteId },
          },
          {
            visitorId: { equals: visitorId },
          },
          {
            healthTag: { tag: { equals: 'Clear' } },
          },
          {
            dateCreated: {
              gte: this.currentDate,
              lte: this.currentDate,
            },
          },
        ],
      },
      select: {
        id: true,
        visitId: true,
        guest: true,
        visitor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            address: true,
            company: true,
          },
        },
        visitorStatus: {
          select: {
            id: true,
            status: true,
            isClear: true,
            clearedBy: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                  },
                },
              },
            },
            dateCleared: true,
            timeCleared: true,
            dateCreated: true,
            timeCreated: true,
          },
        },
        poc: true,
        pocEmail: true,
        travelLocations: true,
        site: true,
        floor: true,
        healthTag: true,
        dateCreated: true,
        timeCreated: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return duplicateVisit;
  }

  isClearOfAnySymptoms(questions: QuestionDTO[]) {
    return questions.map(
      (question) =>
        (question.answers.length === 1 &&
          question.answers[0] === 'None of the above') ||
        question.answers[0] === 'No',
    );
  }

  async getVisitorCurrentVisit(visitId: string) {
    return await this.prismaClientService.visit.findFirst({
      where: {
        visitId,
        AND: {
          dateCreated: {
            gte: this.currentDate,
            lte: this.currentDate,
          },
        },
      },
      select: {
        visitId: true,
        guest: true,
        visitorStatus: {
          select: {
            isClear: true,
            status: true,
          },
        },
        site: {
          select: {
            siteName: true,
          },
        },
        floor: {
          select: {
            floor: true,
          },
        },
        workType: {
          select: {
            type: true,
          },
        },
        leaveType: {
          select: {
            type: true,
          },
        },
        visitor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            company: true,
            address: true,
          },
        },
        poc: true,
        pocEmail: true,
        purposeOfVisit: true,
        healthTag: {
          select: {
            tag: true,
          },
        },
        surveys: {
          select: {
            question: {
              select: {
                question: true,
              },
            },
            answers: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
        travelLocations: true,
        dateCreated: true,
        timeCreated: true,
      },
    });
  }

  async checkVisitorEmail(email: string) {
    const result = await this.prismaClientService.visitor.findUnique({
      where: { email },
    });

    if (result?.isBlocked) {
      throw new BadRequestException('You are blocked by the admin');
    }

    if (result?.isClear === false) {
      throw new BadRequestException(
        'Sorry you are not yet cleared by the admin',
      );
    }

    return result;
  }

  /**
   * @param {string} email visitor email
   * @param {string} modeOfUse 'Create' if will use to create visit or 'Check' for checking
   */
  async checkLastVisitorVisit(data: {
    email: string;
    modeOfUse: 'Create' | 'Check';
  }) {
    const { email, modeOfUse } = data;

    const lastVisit = await this.prismaClientService.visitorStatus.findFirst({
      where: {
        visitor: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      },
      select: {
        id: true,
        status: true,
        isClear: true,
        visitor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            company: true,
          },
        },
        clearedBy: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
              },
            },
          },
        },
        dateCleared: true,
        timeCleared: true,
        dateCreated: true,
        timeCreated: true,
      },
      orderBy: { id: 'desc' },
    });

    if (!lastVisit && modeOfUse === 'Check') {
      throw new NotFoundException('No last visit was found.');
    }

    return lastVisit;
  }

  async blockVisitor(visitorId: number) {
    return await this.prismaClientService.visitor.update({
      where: { id: visitorId },
      data: { isBlocked: true },
      select: {
        id: true,
        isBlocked: true,
      },
    });
  }

  async unblockVisitor(visitorId: number) {
    return await this.prismaClientService.visitor.update({
      where: { id: visitorId },
      data: { isBlocked: false },
      select: {
        id: true,
        isBlocked: true,
      },
    });
  }

  async createVisitorSubEmails(data: CreateSubEmailsDTO) {
    const { subEmails } = data;

    return await this.prismaClientService.visitorSubEmail.createMany({
      data: subEmails,
    });
  }

  async getVisitorNotes(query: PTVisitorNoteQuery) {
    const { page, limit, skip } = paginate(query.page, query.limit);

    const { visitorId } = query;

    const where = {
      visitorId: { equals: visitorId },
    };

    const result = await this.prismaClientService.$transaction([
      this.prismaClientService.visitorNote.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          author: {
            select: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          note: true,
          createdAt: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),
      this.prismaClientService.visitorNote.count({ where }),
    ]);

    return {
      data: result[0],
      pagination: {
        page,
        limit,
        count: result[1],
      },
    };
  }

  async createVisitorNote(data: {
    visitorId: number;
    authorId: number;
    note: string;
  }) {
    const { visitorId, authorId, note } = data;

    return await this.prismaClientService.visitorNote.create({
      data: {
        note,
        authorId,
        visitorId,
      },
      select: {
        id: true,
        author: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        note: true,
        createdAt: true,
      },
    });
  }

  async getTemperatureChecklist(query: PTTemperatureChecklistQuery) {
    const { visitorId, temperature, dateFrom, dateTo, timeFrom, timeTo } =
      query;

    const { page, limit, skip } = paginate(query.page, query.limit);

    const where = {
      visitorId: { equals: visitorId },
      temperature: {
        gte: temperature,
        lte: temperature,
      },
      dateCreated: {
        gte: dateFrom ? new Date(dateFrom) : undefined,
        lte: dateTo ? new Date(dateTo) : undefined,
      },
      timeCreated: {
        gte: timeFrom ? new Date(timeFrom) : undefined,
        lte: timeTo ? new Date(timeTo) : undefined,
      },
    };

    const result = await this.prismaClientService.$transaction([
      this.prismaClientService.tempCheckList.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          temperature: true,
          tag: {
            select: {
              tag: true,
            },
          },
          dateCreated: true,
          timeCreated: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),
      this.prismaClientService.tempCheckList.count({ where }),
    ]);

    return {
      data: result[0],
      pagination: {
        page,
        limit,
        count: result[1],
      },
    };
  }

  async addTemperature(data: { visitorId: number; temperature: number }) {
    const { visitorId, temperature } = data;

    return await this.prismaClientService.tempCheckList.create({
      data: {
        temperature,
        tag: {
          connect: {
            id: temperature >= 38 ? 2 : 1,
          },
        },
        visitor: {
          connect: {
            id: visitorId,
          },
        },
      },
      select: {
        temperature: true,
      },
    });
  }

  async clearVisitor(data: { userId: number; email: string; note: string }) {
    const { userId, email, note } = data;

    const lastVisit = await this.checkLastVisitorVisit({
      email,
      modeOfUse: 'Check',
    });

    const { id, isClear, status } = lastVisit;

    if (isClear) {
      throw new BadRequestException('Visitor health status is clear');
    }

    const clearedVisitor = await this.prismaClientService.visitorStatus.update({
      where: { id },
      data: {
        isClear: true,
        status: status === 'Denied' ? status : 'Approved',
        clearedBy: { connect: { id: userId } },
        dateCleared: this.currentDate,
        timeCleared: this.currentDate,
      },
      select: {
        id: true,
        status: true,
        isClear: true,
        visitor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            company: true,
          },
        },
        clearedBy: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
              },
            },
          },
        },
        dateCleared: true,
        timeCleared: true,
        dateCreated: true,
        timeCreated: true,
      },
    });

    await this.prismaClientService.visitor.update({
      where: { id: clearedVisitor.visitor.id },
      data: { isBlocked: false, isClear: true },
    });

    await this.prismaClientService.visitorNote.create({
      data: {
        note,
        authorId: userId,
        visitorId: clearedVisitor.visitor.id,
      },
    });

    await this.mailService.sendEmailWithTemplate({
      to: clearedVisitor.visitor.email,
      from: 'no-reply@kmc.solutions',
      templateId: this.dhClearanceStatus,
      dynamicTemplateData: {
        firstName: clearedVisitor.visitor.firstName,
      },
      groupId: 15220,
      groupsToDisplay: [15220],
    });

    return clearedVisitor;
  }
}
