/*
  Warnings:

  - You are about to drop the `UserSiteFilter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSiteFilter" DROP CONSTRAINT "UserSiteFilter_userId_fkey";

-- DropForeignKey
ALTER TABLE "_SiteToUserSiteFilter" DROP CONSTRAINT "_SiteToUserSiteFilter_B_fkey";

-- DropTable
DROP TABLE "UserSiteFilter";

-- CreateTable
CREATE TABLE "user_site_filters" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "user_site_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDomainFilter" (
    "id" SERIAL NOT NULL,
    "domains" TEXT[],

    CONSTRAINT "UserDomainFilter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_site_filters_userId_key" ON "user_site_filters"("userId");

-- AddForeignKey
ALTER TABLE "user_site_filters" ADD CONSTRAINT "user_site_filters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteToUserSiteFilter" ADD FOREIGN KEY ("B") REFERENCES "user_site_filters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "answers.answer_unique" RENAME TO "answers_answer_key";

-- RenameIndex
ALTER INDEX "health_tags.tag_unique" RENAME TO "health_tags_tag_key";

-- RenameIndex
ALTER INDEX "leave_types.type_unique" RENAME TO "leave_types_type_key";

-- RenameIndex
ALTER INDEX "permissions.label_unique" RENAME TO "permissions_label_key";

-- RenameIndex
ALTER INDEX "permissions.value_unique" RENAME TO "permissions_value_key";

-- RenameIndex
ALTER INDEX "sites.siteName_unique" RENAME TO "sites_siteName_key";

-- RenameIndex
ALTER INDEX "temperature_tags.tag_unique" RENAME TO "temperature_tags_tag_key";

-- RenameIndex
ALTER INDEX "users.email_unique" RENAME TO "users_email_key";

-- RenameIndex
ALTER INDEX "users.passwordResetToken_unique" RENAME TO "users_passwordResetToken_key";

-- RenameIndex
ALTER INDEX "users.profileId_unique" RENAME TO "users_profileId_key";

-- RenameIndex
ALTER INDEX "visitor_sub_emails.email_unique" RENAME TO "visitor_sub_emails_email_key";

-- RenameIndex
ALTER INDEX "visitors.email_unique" RENAME TO "visitors_email_key";

-- RenameIndex
ALTER INDEX "visits.visitId_unique" RENAME TO "visits_visitId_key";

-- RenameIndex
ALTER INDEX "work_types.type_unique" RENAME TO "work_types_type_key";
