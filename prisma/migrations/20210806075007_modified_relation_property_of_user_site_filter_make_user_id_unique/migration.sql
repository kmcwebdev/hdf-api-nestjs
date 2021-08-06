/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserSiteFilter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSiteFilter.userId_unique" ON "UserSiteFilter"("userId");
