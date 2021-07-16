import { PrismaClient } from '@prisma/client';
import answers from './data/answers';
import healthTags from './data/health-tags';
import leaveTypes from './data/leave-types';
import questions from './data/questions';
import workTypes from './data/work-types';

const prismaClient = new PrismaClient();

export async function seed() {
  const transaction = await prismaClient.$transaction([
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
