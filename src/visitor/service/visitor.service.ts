import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Visitor } from '@prisma/client';
import { CreateVisitorDTO } from 'src/common/dto/visitor/create-visitor.dto';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

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
