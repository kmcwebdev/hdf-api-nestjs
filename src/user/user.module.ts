import { Module } from '@nestjs/common';
import { AzureGraphModule } from 'src/azure-graph/azure-graph.module';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaClientModule, AzureGraphModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
