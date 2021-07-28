import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import answers from './data/answers';
import healthTags from './data/health-tags';
import leaveTypes from './data/leave-types';
import permissions from './data/permissions';
import questions from './data/questions';
import user from './data/user';
import workTypes from './data/work-types';

const prismaClient = new PrismaClient();

export async function seed() {
  const hashedPassword = await hash(user.password, 10);

  const transaction = await prismaClient.$transaction([
    prismaClient.permission.createMany({ data: permissions }),
    prismaClient.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        userType: user.userType,
        permissions: {
          connect: [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 },
          ],
        },
        isLocked: user.isLocked,
        profile: {
          create: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      },
    }),
    prismaClient.question.createMany({ data: questions }),
    prismaClient.answer.createMany({ data: answers }),
    prismaClient.workType.createMany({ data: workTypes }),
    prismaClient.leaveType.createMany({ data: leaveTypes }),
    prismaClient.healthTag.createMany({ data: healthTags }),
    prismaClient.question.update({
      where: { id: 1 },
      data: {
        answers: {
          connect: [
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 },
            { id: 9 },
          ],
        },
      },
    }),
    prismaClient.question.update({
      where: { id: 2 },
      data: {
        answers: {
          connect: [{ id: 10 }, { id: 11 }],
        },
      },
    }),
    prismaClient.question.update({
      where: { id: 3 },
      data: {
        answers: {
          connect: [{ id: 10 }, { id: 11 }],
        },
      },
    }),
    prismaClient.question.update({
      where: { id: 4 },
      data: {
        answers: {
          connect: [{ id: 10 }, { id: 11 }],
        },
      },
    }),
  ]);

  return transaction;
}

seed()
  .then((result) => console.log(result))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })
  .finally(async () => await prismaClient.$disconnect());
