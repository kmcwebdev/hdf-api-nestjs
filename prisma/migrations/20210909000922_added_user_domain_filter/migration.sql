/*
  Warnings:

  - You are about to drop the `user_site_filters` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserDomainFilter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_SiteToUserSiteFilter" DROP CONSTRAINT "_SiteToUserSiteFilter_B_fkey";

-- DropForeignKey
ALTER TABLE "user_site_filters" DROP CONSTRAINT "user_site_filters_userId_fkey";

-- AlterTable
ALTER TABLE "UserDomainFilter" ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "user_site_filters";

-- CreateTable
CREATE TABLE "UserSiteFilter" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "UserSiteFilter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSiteFilter_userId_key" ON "UserSiteFilter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDomainFilter_userId_key" ON "UserDomainFilter"("userId");

-- AddForeignKey
ALTER TABLE "UserSiteFilter" ADD CONSTRAINT "UserSiteFilter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDomainFilter" ADD CONSTRAINT "UserDomainFilter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteToUserSiteFilter" ADD FOREIGN KEY ("B") REFERENCES "UserSiteFilter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
