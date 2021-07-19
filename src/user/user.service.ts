import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { RegisterDTO } from 'src/common/dto/auth/register.dto';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class UserService {
  constructor(private prismaClientService: PrismaClientService) {}

  async register(data: RegisterDTO) {
    const { email, password, userType } = data;

    const hashedPassword = await hash(password, 10);

    const result = await this.prismaClientService.user.create({
      data: { email, password: hashedPassword, userType },
      select: { id: true, email: true, userType: true },
    });

    return result;
  }
}
