/*
  Warnings:

  - You are about to alter the column `clearanceUrl` on the `clearance` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `type` on the `leave_types` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `answers` on the `surveys` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `tag` on the `temperature_tags` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `firstName` on the `user_profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `lastName` on the `user_profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `phoneNumber` on the `user_profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `passwordResetToken` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `status` on the `visitor_status` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `firstName` on the `visitors` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `lastName` on the `visitors` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `email` on the `visitors` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `phoneNumber` on the `visitors` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `address` on the `visitors` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `company` on the `visitors` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `poc` on the `visits` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `pocEmail` on the `visits` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `type` on the `work_types` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "clearance" ALTER COLUMN "clearanceUrl" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "leave_types" ALTER COLUMN "type" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "surveys" ALTER COLUMN "answers" SET DATA TYPE VARCHAR(100)[];

-- AlterTable
ALTER TABLE "temperature_tags" ALTER COLUMN "tag" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "user_profiles" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "passwordResetToken" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "visitor_status" ALTER COLUMN "status" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "visitors" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "company" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "visits" ALTER COLUMN "poc" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "pocEmail" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "work_types" ALTER COLUMN "type" SET DATA TYPE VARCHAR(100);
