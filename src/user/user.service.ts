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
import { PTUserQuery } from 'src/common/query/user.query';
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
          },
          createdAt: {
            gte: createdFrom ? new Date(createdFrom) : undefined,
            lte: createdTo ? new Date(createdTo) : undefined,
          },
        },
        select: {
          id: true,
          email: true,
          userType: true,
          isLocked: true,
          profile: true,
          createdAt: true,
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
          },
          createdAt: {
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
        isLocked: true,
        profile: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(data: { id: number; payload: PTUpdateProfileDTO }) {
    const { id, payload } = data;

    return await this.prismaClientService.userProfile.update({
      where: { id },
      data: payload,
    });
  }

  async registerInternalUser(data: InternalRegisterDTO) {
    const { email } = data;

    const checkDuplication = await this.prismaClientService.user.findUnique({
      where: { email },
    });

    if (checkDuplication) {
      throw new BadRequestException('User is already registered');
    }

    const graphApi = await firstValueFrom<GraphUser>(
      this.azureGraphService.getEmailDetails(email),
    );

    if (!graphApi) {
      throw new NotFoundException(`No user found with this email: ${email}`);
    }

    const hashedPassword = await hashPassword(graphApi.id);

    const result = await this.prismaClientService.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: UserType.Internal,
        isLocked: false,
        profile: {
          create: {
            firstName: graphApi.givenName,
            lastName: graphApi.surName,
          },
        },
      },
      select: { id: true, email: true, userType: true },
    });

    return result;
  }

  async registerExternalUser(data: ExternalRegisterDTO) {
    const { email, firstName, lastName, organization, password } = data;

    const hashedPassword = await hashPassword(password);

    const result = await this.prismaClientService.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: UserType.External,
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
