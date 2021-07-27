/*
  Warnings:

  - You are about to alter the column `name` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `imageUrl` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `contactPerson` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `contactEmail` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `floor` on the `floors` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `type` on the `permissions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `token` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `siteName` on the `sites` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - The `answer` column on the `surveys` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `userType` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "imageUrl" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "contactPerson" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "contactEmail" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "floors" ALTER COLUMN "floor" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "permissions" ALTER COLUMN "type" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "token" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "sites" ALTER COLUMN "siteName" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "surveys" DROP COLUMN "answer",
ADD COLUMN     "answer" TEXT[];

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "userType" SET DATA TYPE VARCHAR(50);
