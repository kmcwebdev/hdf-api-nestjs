/*
  Warnings:

  - You are about to drop the `_UserToUserSiteFilter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserToUserSiteFilter" DROP CONSTRAINT "_UserToUserSiteFilter_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserSiteFilter" DROP CONSTRAINT "_UserToUserSiteFilter_B_fkey";

-- AlterTable
ALTER TABLE "UserSiteFilter" ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "_UserToUserSiteFilter";

-- AddForeignKey
ALTER TABLE "UserSiteFilter" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
