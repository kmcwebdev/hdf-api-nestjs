/*
  Warnings:

  - You are about to drop the `user_site_filters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SiteToUserSiteFilter" DROP CONSTRAINT "_SiteToUserSiteFilter_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserSiteFilter" DROP CONSTRAINT "_UserToUserSiteFilter_B_fkey";

-- DropTable
DROP TABLE "user_site_filters";

-- CreateTable
CREATE TABLE "_user_site_filters" (
    "id" SERIAL NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "_UserToUserSiteFilter" ADD FOREIGN KEY ("B") REFERENCES "_user_site_filters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteToUserSiteFilter" ADD FOREIGN KEY ("B") REFERENCES "_user_site_filters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
