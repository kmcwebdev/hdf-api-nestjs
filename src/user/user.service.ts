import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AzureGraphService } from 'src/azure-graph/azure-graph.service';
import { GraphUser } from 'src/azure-graph/interface/get-user.interface';
import { mailDomainIs } from 'src/common/utils/email-domain-check.util';
import { hashPassword } from 'src/common/utils/hashed-password.util';
import { paginate } from 'src/common/utils/paginate.util';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { ExternalRegisterDTO } from 'src/user/dto/external-register.dto';
import { UserType } from 'src/user/enum/user-type.enum';
import { PTUserQuery } from 'src/user/query/user.query';
import { InternalRegisterDTO } from './dto/internal-register.dto';
import { PTUpdateProfileDTO } from './dto/update-profile.dto';
import { UpdateUserPermissionDTO } from './dto/update-user-permission.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaClientService: PrismaClientService,
    private azureGraphService: AzureGraphService,
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

    const where = {
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
    } as const;

    const result = await this.prismaClientService.$transaction([
      this.prismaClientService.user.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          email: true,
          userType: true,
          permissions: {
            select: {
              id: true,
              label: true,
              value: true,
            },
          },
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
            label: true,
            value: true,
          },
        },
        isLocked: true,
        profile: true,
        dateCreated: true,
        timeCreated: true,
      },
    });
  }

  async getUserPermissions() {
    return await this.prismaClientService.permission.findMany();
  }

  async updateUserPermissions(data: {
    method: 'PATCH' | 'DELETE';
    userId: number;
    payload: UpdateUserPermissionDTO;
  }) {
    const { method, userId, payload } = data;

    return await this.prismaClientService.user.update({
      where: { id: userId },
      data: {
        permissions: {
          [method === 'PATCH' ? 'connect' : 'disconnect']: {
            value: payload.permission,
          },
        },
      },
      select: {
        id: true,
        permissions: {
          select: {
            id: true,
            label: true,
            value: true,
          },
        },
      },
    });
  }

  async checkUserByEmail(email: string) {
    const user = await this.prismaClientService.user.findUnique({
      where: { email },
    });

    return user;
  }

  async checkInternalUserInAzureAd(email: string) {
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

    const user = await this.checkUserByEmail(email);

    return user;
  }

  async updateProfile(data: { id: number; payload: PTUpdateProfileDTO }) {
    const { id, payload } = data;

    return await this.prismaClientService.user.update({
      where: { id },
      data: {
        profile: {
          update: payload,
        },
      },
      select: {
        id: true,
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            organization: true,
          },
        },
      },
    });
  }

  async lockUser(lockUserId: number) {
    return await this.prismaClientService.user.update({
      where: { id: lockUserId },
      data: {
        isLocked: true,
      },
      select: {
        id: true,
        email: true,
        isLocked: true,
      },
    });
  }

  async unlockUser(lockUserId: number) {
    return await this.prismaClientService.user.update({
      where: { id: lockUserId },
      data: {
        isLocked: false,
      },
      select: {
        id: true,
        email: true,
        isLocked: true,
      },
    });
  }

  async registerInternalUser(data: {
    userId: number;
    payload: InternalRegisterDTO;
  }) {
    const { userId, payload } = data;
    const { email } = payload;

    const internalUser = await this.checkInternalUserInAzureAd(email);

    const checkDuplication = await this.checkUserByEmail(internalUser.mail);

    if (checkDuplication) {
      return checkDuplication;
    }

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

    const checkDuplication = await this.checkExternalUserDuplication(email);

    if (Object.keys(checkDuplication).length) {
      return checkDuplication;
    }

    const hashedPassword = await hashPassword(password);

    const result = await this.prismaClientService.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: UserType.External,
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
