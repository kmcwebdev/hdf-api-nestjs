/*
  Warnings:

  - You are about to drop the column `dateCreated` on the `visitor_notes` table. All the data in the column will be lost.
  - You are about to drop the column `timeCreated` on the `visitor_notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "visitor_notes" DROP COLUMN "dateCreated",
DROP COLUMN "timeCreated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
