import { BadRequestException, Injectable } from '@nestjs/common';
import { Visitor } from '@prisma/client';
import { CreateGuestVisitorDTO } from 'src/common/dto/visitor/guest/create-guest-visitor.dto';
import { mailDomainIs } from 'src/common/utils/email-domain-check.util';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { VisitorService } from './visitor.service';

@Injectable()
export class GuestService {
  constructor(
    private prismaClientService: PrismaClientService,
    private visitorService: VisitorService,
  ) {}

  async createGuestVisitor(data: CreateGuestVisitorDTO) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      address,
      city,
      questions,
      siteId,
      floorId,
      poc,
      pocEmail,
    } = data;

    // if email is michael@kmc.solutions auto approve.
    let guest: Visitor;

    if (mailDomainIs(email, 'kmc.solutions')) {
      throw new BadRequestException(
        'Email domain is not valid for guest declaration',
      );
    }

    const oldVisitStatus =
      await this.visitorService.checkLastVisitorVisitStatus(email);

    if (oldVisitStatus?.isClear === false) {
      throw new BadRequestException(
        'Sorry you are not yet cleared  by the admin',
      );
    }

    const duplicateVisit = await this.prismaClientService.guestVisit.findFirst({
      where: {
        AND: [
          {
            dateCreated: { equals: new Date(Date.now()) },
          },
          {
            siteId: { equals: siteId },
          },
          {
            healthTag: { tag: { equals: 'Clear' } },
          },
        ],
      },
      select: {
        id: true,
        poc: true,
        pocEmail: true,
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

    if (duplicateVisit) {
      return duplicateVisit;
    }

    const getVisitor = await this.visitorService.checkVisitorEmail(email);

    if (getVisitor) {
      guest = getVisitor;
    }

    if (!getVisitor) {
      const createdGuestVisitor = await this.prismaClientService.visitor.create(
        {
          data: {
            guest: true,
            firstName,
            lastName,
            email,
            phoneNumber,
            address,
            company,
          },
        },
      );

      guest = createdGuestVisitor;
    }

    if (city) {
      await this.prismaClientService.travelLocation.create({
        data: { city, visitor: { connect: { id: guest.id } } },
      });
    }

    questions.forEach(async (data) => {
      await this.prismaClientService.guestSurvey.create({
        data: {
          visitor: { connect: { id: guest.id } },
          question: { connect: { id: data.questionId } },
          answer: data.answer,
        },
      });
    });

    const allTrue = questions
      .map(
        (data) =>
          data.answer.includes('None of the above') ||
          data.answer.includes('No'),
      )
      .filter((answer) => answer === false).length;

    const healthTag = await this.prismaClientService.healthTag.findUnique({
      where: { id: allTrue ? 2 : 1 },
    });

    const visit = await this.prismaClientService.guestVisit.create({
      data: {
        visitor: { connect: { id: guest.id } },
        site: { connect: { siteId } },
        floor: { connect: { floorId } },
        poc,
        pocEmail,
        healthTag: { connect: { id: healthTag.id } },
      },
      select: {
        id: true,
        poc: true,
        pocEmail: true,
        site: true,
        floor: true,
        healthTag: true,
        dateCreated: true,
        timeCreated: true,
      },
    });

    await this.prismaClientService.visitorStatus.create({
      data: {
        visitor: { connect: { id: guest.id } },
        status: allTrue ? 'Denied' : 'Pending for approval',
        isClear: allTrue ? false : true,
      },
    });

    return visit;
  }
}
