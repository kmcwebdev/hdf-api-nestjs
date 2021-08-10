import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeaveType, Visit } from '@prisma/client';
import { format } from 'date-fns';
import { MailService } from 'src/mail/mail.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateMemberVisitorDTO } from 'src/visitor/dto/visitor/member/create-member-visit.dto';
import { VisitorService } from './visitor.service';

@Injectable()
export class MemberService {
  private hdConfirmationMemberOnSite: string;
  private hdConfirmationMemberWorkingFromHome: string;
  private hdConfirmationMemberOnLeave: string;

  constructor(
    private prismaClientService: PrismaClientService,
    private visitorService: VisitorService,
    private config: ConfigService<{
      sendGrid: {
        hdConfirmationMemberOnSite: string;
        hdConfirmationMemberWorkingFromHome: string;
        hdConfirmationMemberOnLeave: string;
      };
    }>,
    private mailService: MailService,
  ) {
    this.hdConfirmationMemberOnSite = this.config.get<string>(
      'sendGrid.hdConfirmationMemberOnSite',
      {
        infer: true,
      },
    );
    this.hdConfirmationMemberWorkingFromHome = this.config.get<string>(
      'sendGrid.hdConfirmationMemberWorkingFromHome',
      {
        infer: true,
      },
    );
    this.hdConfirmationMemberOnLeave = this.config.get<string>(
      'sendGrid.hdConfirmationMemberOnLeave',
      {
        infer: true,
      },
    );
  }

  async createMemberVisitor(data: CreateMemberVisitorDTO) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      address,
      workTypeId,
      leaveTypeId,
      travelLocations,
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

    // Manual!!!
    if (leaveTypeId && workTypeId !== 3) {
      throw new BadRequestException(
        'Failed to connect work type to leave type.',
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

    const memberNeedsAttention = this.visitorService
      .isClearOfAnySymptoms(questions)
      .filter((answer) => answer === false).length;

    const healthTag = await this.prismaClientService.healthTag.findUnique({
      where: { id: memberNeedsAttention ? 2 : 1 },
    });

    let visit: Visit;

    if (workTypeId === 1) {
      visit = await this.prismaClientService.visit.create({
        data: {
          guest: false,
          visitor: { connect: { id: member.id } },
          workType: { connect: { id: workTypeId } },
          travelLocations: [travelLocations],
          site: { connect: { siteId } },
          floor: { connect: { floorId } },
          healthTag: { connect: { id: healthTag.id } },
        },
      });
    }

    if (workTypeId === 2) {
      visit = await this.prismaClientService.visit.create({
        data: {
          guest: false,
          visitor: { connect: { id: member.id } },
          workType: { connect: { id: workTypeId } },
          travelLocations: [travelLocations],
          healthTag: { connect: { id: healthTag.id } },
        },
      });
    }

    if (workTypeId === 3) {
      visit = await this.prismaClientService.visit.create({
        data: {
          guest: false,
          visitor: { connect: { id: member.id } },
          workType: { connect: { id: workTypeId } },
          leaveType: { connect: { id: leaveTypeId } },
          // Manual?
          travelLocations: [travelLocations],
          site: { connect: { siteId } },
          floor: { connect: { floorId } },
          healthTag: { connect: { id: healthTag.id } },
        },
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
        status: memberNeedsAttention ? 'Denied' : 'Approved',
        isClear: memberNeedsAttention ? false : true,
      },
    });

    if (memberNeedsAttention) {
      await this.prismaClientService.visitor.update({
        where: { id: member.id },
        data: { isBlocked: true },
      });
    }

    const createdVisit = await this.prismaClientService.visit.findUnique({
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
        workType: true,
        leaveType: leaveTypeId ? true : false,
        travelLocations: true,
        site: workTypeId === 1 ? true : false,
        floor: workTypeId === 1 ? true : false,
        healthTag: true,
        dateCreated: true,
        timeCreated: true,
      },
    });

    let leaveType: LeaveType;
    let siteName: string;
    let siteFloor: string;

    const { type } = await this.prismaClientService.workType.findUnique({
      where: { id: workTypeId },
    });

    if (leaveTypeId) {
      leaveType = await this.prismaClientService.leaveType.findUnique({
        where: { id: leaveTypeId },
      });
    }

    if (siteId) {
      const site = await this.prismaClientService.site.findUnique({
        where: { siteId },
      });

      siteName = site.siteName;
    }

    if (floorId) {
      const { floor } = await this.prismaClientService.floor.findUnique({
        where: { floorId },
      });

      siteFloor = floor;
    }

    if (workTypeId === 1) {
      await this.mailService.sendEmailWithTemplate({
        to: !memberNeedsAttention ? email : 'health@kmc.solutions',
        from: 'no-reply@kmc.solutions',
        templateId: this.hdConfirmationMemberOnSite,
        dynamicTemplateData: {
          dateOfVisit: format(new Date(), 'MMMM dd, yyyy hh:mm a'),
          firstName,
          lastName,
          email,
          workType: type,
          company,
          site: siteName,
          floor: siteFloor,
          status: memberNeedsAttention ? 'Needs attention' : 'Clear',
        },
        groupId: 15220,
        groupsToDisplay: [15220],
      });
    }

    // Need to add some details
    if (workTypeId === 2) {
      await this.mailService.sendEmailWithTemplate({
        to: !memberNeedsAttention ? email : 'health@kmc.solutions',
        from: 'no-reply@kmc.solutions',
        templateId: this.hdConfirmationMemberWorkingFromHome,
        dynamicTemplateData: {
          dateOfVisit: format(new Date(), 'MMMM dd, yyyy hh:mm a'),
          firstName,
          lastName,
          email,
          workType: type,
          company,
          status: memberNeedsAttention ? 'Needs attention' : 'Clear',
        },
        groupId: 15220,
        groupsToDisplay: [15220],
      });
    }

    // Need to add some details
    if (workTypeId === 3) {
      const ON_LEAVE_MEMBER_NEEDS_ATTENTION =
        memberNeedsAttention ||
        leaveType.type === 'Sick leave' ||
        leaveType.type === 'Quarantine leave';

      await this.mailService.sendEmailWithTemplate({
        to: ON_LEAVE_MEMBER_NEEDS_ATTENTION ? 'health@kmc.solutions' : email,
        from: 'no-reply@kmc.solutions',
        templateId: this.hdConfirmationMemberOnLeave,
        dynamicTemplateData: {
          dateOfVisit: format(new Date(), 'MMMM dd, yyyy hh:mm a'),
          firstName,
          lastName,
          email,
          workType: type,
          leaveType: leaveType.type,
          company,
          status: ON_LEAVE_MEMBER_NEEDS_ATTENTION ? 'Needs attention' : 'Clear',
        },
        groupId: 15220,
        groupsToDisplay: [15220],
      });
    }

    return createdVisit;
  }
}
