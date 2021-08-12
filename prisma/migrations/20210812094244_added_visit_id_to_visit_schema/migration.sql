/*
  Warnings:

  - A unique constraint covering the columns `[visitId]` on the table `visits` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `visitId` to the `visits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "visits" ADD COLUMN     "visitId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "visits.visitId_unique" ON "visits"("visitId");
