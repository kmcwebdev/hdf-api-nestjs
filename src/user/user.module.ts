import { Module } from '@nestjs/common';
import { AzureGraphApiModule } from 'src/azure-graph-api/azure-graph-api.module';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaClientModule, AzureGraphApiModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
