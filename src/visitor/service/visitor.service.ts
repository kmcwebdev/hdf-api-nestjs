import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Visitor } from '@prisma/client';
import { paginate } from 'src/common/utils/paginate.util';
import { MailService } from 'src/mail/mail.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateSubEmailsDTO } from 'src/visitor/dto/visitor/create-sub-emails.dto';
import { CreateVisitorDTO } from 'src/visitor/dto/visitor/create-visitor.dto';
import { QuestionDTO } from '../dto/visitor/question.dto';
import { PTVisitQuery } from '../query/visit.query';

@Injectable()
export class VisitorService {
  private dhClearanceStatus: string;

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
  }

  async getVisits(query: PTVisitQuery) {
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

    const where = {
      guest: { equals: guest },
      visitor: {
        firstName: { equals: firstName, mode: 'insensitive' },
        lastName: { equals: lastName, mode: 'insensitive' },
        email: { equals: email, mode: 'insensitive' },
      },
      siteId: { equals: siteId },
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
          guest: true,
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
          dateCreated: true,
          timeCreated: true,
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
              gte: new Date(Date.now()),
              lte: new Date(Date.now()),
            },
          },
        ],
      },
      select: {
        id: true,
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
  async checkLastVisitorVisitStatus(data: {
    email: string;
    modeOfUse: 'Create' | 'Check';
  }) {
    const { email, modeOfUse } = data;

    const lastVisit = await this.prismaClientService.visitorStatus.findFirst({
      where: { visitor: { email: { equals: email, mode: 'insensitive' } } },
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

  async updateVisitor() {
    return true;
  }

  async createVisitorSubEmails(data: CreateSubEmailsDTO) {
    const { subEmails } = data;

    return await this.prismaClientService.visitorSubEmail.createMany({
      data: subEmails,
    });
  }

  async clearVisitor(data: { userId: number; email: string }) {
    const { userId, email } = data;

    const lastVisit = await this.checkLastVisitorVisitStatus({
      email,
      modeOfUse: 'Check',
    });

    const { id, isClear, clearedBy, status } = lastVisit;

    if (isClear && clearedBy) {
      return lastVisit;
    }

    const clearedVisitor = await this.prismaClientService.visitorStatus.update({
      where: { id },
      data: {
        isClear: true,
        status: status === 'Denied' ? status : 'Approved',
        clearedBy: { connect: { id: userId } },
        dateCleared: new Date(Date.now()),
        timeCleared: new Date(Date.now()),
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
      data: { isClear: true },
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
