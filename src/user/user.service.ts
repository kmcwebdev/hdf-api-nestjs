import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AzureGraphApiService } from 'src/azure-graph-api/azure-graph-api.service';
import { ExternalRegisterDTO } from 'src/common/dto/user/external-register.dto';
import { InternalRegisterDTO } from 'src/common/dto/user/internal-register.dto';
import { PTUpdateProfileDTO } from 'src/common/dto/user/update-profile.dto';
import { UserType } from 'src/common/enum/user-type.enum';
import { GraphUser } from 'src/common/interface/azure-graph/get-user.interface';
import { PTUserQuery } from 'src/common/query/user/user.query';
import { mailDomainIs } from 'src/common/utils/email-domain-check.util';
import { hashPassword } from 'src/common/utils/hashed-password.util';
import { paginate } from 'src/common/utils/paginate.util';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class UserService {
  constructor(
    private prismaClientService: PrismaClientService,
    private azureGraphService: AzureGraphApiService,
  ) {}

  async getUsers(query: PTUserQuery) {
    const {
      email,
      userType,
      isLocked,
      firstName,
      lastName,
      phoneNumber,
      organization,
      createdFrom,
      createdTo,
    } = query;

    const { page, limit, skip } = paginate(query.page, query.limit);

    const result = await this.prismaClientService.$transaction([
      this.prismaClientService.user.findMany({
        skip,
        take: limit,
        where: {
          email: { contains: email, mode: 'insensitive' },
          userType: { equals: userType },
          isLocked: { equals: isLocked },
          profile: {
            firstName: { contains: firstName, mode: 'insensitive' },
            lastName: { contains: lastName, mode: 'insensitive' },
            phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
            organization: { contains: organization, mode: 'insensitive' },
          },
          dateCreated: {
            gte: createdFrom ? new Date(createdFrom) : undefined,
            lte: createdFrom ? new Date(createdTo) : undefined,
          },
        },
        select: {
          id: true,
          email: true,
          userType: true,
          isLocked: true,
          profile: true,
          dateCreated: true,
          timeCreated: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),
      this.prismaClientService.user.count({
        where: {
          email: { contains: email, mode: 'insensitive' },
          userType: { equals: userType },
          isLocked: { equals: isLocked },
          profile: {
            firstName: { contains: firstName, mode: 'insensitive' },
            lastName: { contains: lastName, mode: 'insensitive' },
            phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
            organization: { contains: organization, mode: 'insensitive' },
          },
          dateCreated: {
            gte: createdFrom ? new Date(createdFrom) : undefined,
            lte: createdTo ? new Date(createdTo) : undefined,
          },
        },
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

  async getUser(id: number) {
    return await this.prismaClientService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        userType: true,
        permissions: {
          select: {
            id: true,
            type: true,
          },
        },
        isLocked: true,
        profile: true,
        dateCreated: true,
        timeCreated: true,
      },
    });
  }

  async checkUserEmail(email: string) {
    const userEmail = await this.prismaClientService.user.findUnique({
      where: { email },
    });

    return userEmail;
  }

  async checkInternalUserDuplication(email: string) {
    const checkDuplication = await this.checkUserEmail(email);

    if (checkDuplication) {
      throw new BadRequestException('User is already registered');
    }

    const internalUser = await firstValueFrom<GraphUser>(
      this.azureGraphService.getEmailDetails(email),
    );

    if (!internalUser) {
      throw new NotFoundException(`No user found with this email: ${email}`);
    }

    return internalUser;
  }

  async checkExternalUserDuplication(email: string) {
    if (mailDomainIs(email, 'kmc.solutions')) {
      throw new BadRequestException('This is an external user email');
    }

    const checkDuplication = await this.checkUserEmail(email);

    if (checkDuplication) {
      return {
        isAvailable: false,
      };
    }

    return {
      isAvailable: true,
    };
  }

  async updateProfile(data: { id: number; payload: PTUpdateProfileDTO }) {
    const { id, payload } = data;

    return await this.prismaClientService.userProfile.update({
      where: { id },
      data: payload,
    });
  }

  async lockUser(data: { lockUserId: number; lockedById: number }) {
    const { lockUserId, lockedById } = data;

    return await this.prismaClientService.user.update({
      where: { id: lockUserId },
      data: {
        isLocked: true,
        lockedLogs: { create: { lockedById, operation: 'Locked' } },
      },
    });
  }

  async unlockUser(data: { lockUserId: number; lockedById: number }) {
    const { lockUserId, lockedById } = data;

    return await this.prismaClientService.user.update({
      where: { id: lockUserId },
      data: {
        isLocked: false,
        lockedLogs: { create: { lockedById, operation: 'Unlocked' } },
      },
    });
  }

  async registerInternalUser(data: {
    userId: number;
    payload: InternalRegisterDTO;
  }) {
    const { userId, payload } = data;
    const { email } = payload;

    const internalUser = await this.checkInternalUserDuplication(email);

    const hashedPassword = await hashPassword(internalUser.id);

    const result = await this.prismaClientService.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: UserType.Internal,
        emailConfirm: true,
        isLocked: false,
        registeredBy: {
          connect: { id: userId },
        },
        profile: {
          create: {
            firstName: internalUser.givenName,
            lastName: internalUser.surName,
          },
        },
      },
      select: { id: true, email: true, userType: true },
    });

    return result;
  }

  async registerExternalUser(data: {
    userId: number;
    payload: ExternalRegisterDTO;
  }) {
    const { userId, payload } = data;
    const { email, firstName, lastName, organization, password } = payload;

    const hashedPassword = await hashPassword(password);

    const result = await this.prismaClientService.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: UserType.External,
        emailConfirm: false,
        isLocked: false,
        registeredBy: {
          connect: { id: userId },
        },
        profile: {
          create: {
            firstName,
            lastName,
            organization,
          },
        },
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            organization: true,
          },
        },
        userType: true,
      },
    });

    return result;
  }
}
