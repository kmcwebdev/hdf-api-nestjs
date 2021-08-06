/*
  Warnings:

  - You are about to drop the `_SiteToUserSiteFilter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserSiteFilter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_user_site_filters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SiteToUserSiteFilter" DROP CONSTRAINT "_SiteToUserSiteFilter_A_fkey";

-- DropForeignKey
ALTER TABLE "_SiteToUserSiteFilter" DROP CONSTRAINT "_SiteToUserSiteFilter_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserSiteFilter" DROP CONSTRAINT "_UserToUserSiteFilter_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserSiteFilter" DROP CONSTRAINT "_UserToUserSiteFilter_B_fkey";

-- DropTable
DROP TABLE "_SiteToUserSiteFilter";

-- DropTable
DROP TABLE "_UserToUserSiteFilter";

-- DropTable
DROP TABLE "_user_site_filters";
