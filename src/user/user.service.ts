import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { ExternalRegisterDTO } from 'src/common/dto/user/external-register.dto';
import { InternalRegisterDTO } from 'src/common/dto/user/internal-register.dto';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class UserService {
  constructor(private prismaClientService: PrismaClientService) {}

  async getUser(id: number) {
    return await this.prismaClientService.user.findUnique({
      where: { id },
      select: { id: true, email: true, userType: true, isLocked: true },
    });
  }

  async registerExternalUser(data: ExternalRegisterDTO) {
    const { email, password, userType } = data;

    const hashedPassword = await hash(password, 10);

    const result = await this.prismaClientService.user.create({
      data: { email, password: hashedPassword, userType },
      select: { id: true, email: true, userType: true },
    });

    return result;
  }

  async registerInternalUser(data: InternalRegisterDTO) {
    const { email, password, userType } = data;

    const hashedPassword = await hash(password, 10);

    const result = await this.prismaClientService.user.create({
      data: { email, password: hashedPassword, userType, isLocked: false },
      select: { id: true, email: true, userType: true },
    });

    return result;
  }
}
