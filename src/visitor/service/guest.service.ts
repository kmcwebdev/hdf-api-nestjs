import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';
import { mailDomainIs } from 'src/common/utils/email-domain-check.util';
import { MailService } from 'src/mail/mail.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateGuestVisitorDTO } from 'src/visitor/dto/visitor/guest/create-guest-visitor.dto';
import { VisitorService } from './visitor.service';

@Injectable()
export class GuestService {
  private mode: string;
  private hdGuestApproval: string;
  private hdNeedsAttention: string;

  constructor(
    private prismaClientService: PrismaClientService,
    private visitorService: VisitorService,
    private config: ConfigService<{
      env: {
        mode: string;
      };
      sendGrid: {
        hdGuestApproval: string;
        hdNeedsAttention: string;
      };
    }>,
    private mailService: MailService,
  ) {
    this.mode = this.config.get<string>('env.mode', {
      infer: true,
    });
    this.hdGuestApproval = this.config.get<string>('sendGrid.hdGuestApproval', {
      infer: true,
    });
    this.hdNeedsAttention = this.config.get<string>(
      'sendGrid.hdNeedsAttention',
      {
        infer: true,
      },
    );
  }

  async createGuestVisitor(data: CreateGuestVisitorDTO) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      address,
      travelLocations,
      questions,
      siteId,
      floorId,
      poc,
      pocEmail,
      purposeOfVisit,
    } = data;

    if (mailDomainIs(email, 'kmc.solutions')) {
      throw new BadRequestException('Please use the member declaration form.');
    }

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

    const guest = await this.visitorService.getOrCreateVisitor({
      email,
      firstName,
      lastName,
      address,
      company,
      phoneNumber,
    });

    const duplicateVisit = await this.visitorService.checkDuplicateVisit({
      siteId,
      visitorId: guest.id,
      isGuest: true,
    });

    if (duplicateVisit) {
      return duplicateVisit;
    }

    const guestNeedsAttention = this.visitorService
      .isClearOfAnySymptoms(questions)
      .filter((answer) => answer === false).length;

    const healthTag = await this.prismaClientService.healthTag.findUnique({
      where: { id: guestNeedsAttention ? 2 : 1 },
    });

    const visit = await this.prismaClientService.visit.create({
      data: {
        guest: true,
        visitor: { connect: { id: guest.id } },
        // Manual?
        travelLocations: [travelLocations],
        site: { connect: { siteId } },
        floor: { connect: { floorId } },
        poc,
        pocEmail,
        purposeOfVisit,
        healthTag: { connect: { id: healthTag.id } },
      },
    });

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
        visitor: { connect: { id: guest.id } },
        visit: { connect: { id: visit.id } },
        status: guestNeedsAttention ? 'Denied' : 'Pending for approval',
        isClear: guestNeedsAttention ? false : true,
      },
    });

    if (guestNeedsAttention) {
      await this.prismaClientService.visitor.update({
        where: { id: guest.id },
        data: { isBlocked: true },
      });
    }

    const guestVisit = await this.prismaClientService.visit.findUnique({
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
        poc: true,
        pocEmail: true,
        travelLocations: true,
        site: true,
        floor: true,
        healthTag: true,
        dateCreated: true,
        timeCreated: true,
      },
    });

    const { siteName, siteEmail } =
      await this.prismaClientService.site.findUnique({
        where: { siteId },
      });

    const { floor } = await this.prismaClientService.floor.findUnique({
      where: { floorId },
    });

    const sendTo =
      this.mode === 'development'
        ? 'christian.sulit@kmc.solutions'
        : 'health@kmc.solutions';

    if (!guestNeedsAttention) {
      await this.mailService.sendEmailWithTemplate({
        to: mailDomainIs(pocEmail, 'kmc.solutions') ? pocEmail : siteEmail,
        from: 'no-reply@kmc.solutions',
        templateId: this.hdGuestApproval,
        dynamicTemplateData: {
          dateOfVisit: format(new Date(), 'MMMM dd, yyyy hh:mm a'),
          firstName,
          lastName,
          email,
          company,
          personToVisit: poc,
          site: siteName,
          floor,
          status: guestNeedsAttention ? 'Needs attention' : 'Clear',
          purposeOfVisit,
          link: 'https://hdf.kmc.solutions',
        },
        groupId: 15220,
        groupsToDisplay: [15220],
      });
    }

    if (guestNeedsAttention) {
      await this.prismaClientService.visitor.update({
        where: { id: guest.id },
        data: { isClear: false },
      });

      await this.mailService.sendEmailWithTemplate({
        to: sendTo,
        from: 'no-reply@kmc.solutions',
        templateId: this.hdNeedsAttention,
        dynamicTemplateData: {
          dateOfVisit: format(new Date(), 'MMMM dd, yyyy hh:mm a'),
          firstName,
          lastName,
          email,
          company,
          personToVisit: poc,
          site: siteName,
          floor,
          status: guestNeedsAttention ? 'Needs attention' : 'Clear',
          link: 'https://hdf.kmc.solutions',
        },
        groupId: 15220,
        groupsToDisplay: [15220],
      });
    }

    return guestVisit;
  }
}
