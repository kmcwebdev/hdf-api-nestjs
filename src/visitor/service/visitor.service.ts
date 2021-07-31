import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Visitor } from '@prisma/client';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateSubEmailsDTO } from 'src/visitor/dto/visitor/create-sub-emails.dto';
import { CreateVisitorDTO } from 'src/visitor/dto/visitor/create-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(private prismaClientService: PrismaClientService) {}

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
            dateCreated: { equals: new Date(Date.now()) },
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
        travelLocation: true,
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

  async checkVisitorEmail(email: string) {
    const result = await this.prismaClientService.visitor.findUnique({
      where: { email },
    });

    if (result?.isBlocked) {
      throw new BadRequestException('You are blocked by the admin');
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
      throw new NotFoundException('No last visit found');
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

    if (lastVisit.isClear && lastVisit.clearedBy) {
      return lastVisit;
    }

    return await this.prismaClientService.visitorStatus.update({
      where: { id: lastVisit.id },
      data: {
        isClear: true,
        status: lastVisit.status === 'Denied' ? lastVisit.status : 'Approved',
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
  }
}
