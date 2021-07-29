import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemberVisitorDTO } from 'src/common/dto/visitor/member/create-member-visit.dto';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { VisitorService } from './visitor.service';

@Injectable()
export class MemberService {
  constructor(
    private prismaClientService: PrismaClientService,
    private visitorService: VisitorService,
  ) {}

  async createMemberVisitor(data: CreateMemberVisitorDTO) {
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
    } = data;

    const oldVisitStatus =
      await this.visitorService.checkLastVisitorVisitStatus({
        email,
        modeOfUse: 'Create',
      });

    if (oldVisitStatus?.isClear === false) {
      throw new BadRequestException(
        'Sorry you are not yet cleared by the admin',
      );
    }

    const member = await this.visitorService.getOrCreateVisitor({
      email,
      firstName,
      lastName,
      address,
      company,
      phoneNumber,
    });

    const duplicateVisit = await this.visitorService.checkDuplicateVisit({
      siteId,
      visitorId: member.id,
      isGuest: false,
    });

    if (duplicateVisit) {
      return duplicateVisit;
    }

    const memberIsClearOfAnySymptoms = questions
      .map(
        (question) =>
          question.answers.includes('None of the above') ||
          question.answers.includes('No'),
      )
      .filter((answer) => answer === false).length;

    const healthTag = await this.prismaClientService.healthTag.findUnique({
      where: { id: memberIsClearOfAnySymptoms ? 2 : 1 },
    });

    const visit = await this.prismaClientService.visit.create({
      data: {
        guest: false,
        visitor: { connect: { id: member.id } },
        site: { connect: { siteId } },
        floor: { connect: { floorId } },
        healthTag: { connect: { id: healthTag.id } },
      },
    });

    if (city) {
      await this.prismaClientService.travelLocation.create({
        data: { city, visit: { connect: { id: visit.id } } },
      });
    }

    questions.forEach(async (question) => {
      await this.prismaClientService.survey.create({
        data: {
          visit: { connect: { id: visit.id } },
          question: { connect: { id: question.questionId } },
          answers: question.answers,
        },
      });
    });

    await this.prismaClientService.visitorStatus.create({
      data: {
        visitor: { connect: { id: member.id } },
        visit: { connect: { id: visit.id } },
        status: memberIsClearOfAnySymptoms ? 'Denied' : 'Approved',
        isClear: memberIsClearOfAnySymptoms ? false : true,
      },
    });

    return await this.prismaClientService.visit.findUnique({
      where: { id: visit.id },
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
        travelLocation: true,
        site: true,
        floor: true,
        healthTag: true,
        dateCreated: true,
        timeCreated: true,
      },
    });
  }
}
