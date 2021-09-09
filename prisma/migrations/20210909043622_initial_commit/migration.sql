-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER,
    "email" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "userType" VARCHAR(50) NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT true,
    "registeredById" INTEGER,
    "passwordResetToken" VARCHAR(255),
    "passwordResetTokenExpire" TIMESTAMP(3),
    "passwordChangedAt" TIMESTAMP(3),
    "emailConfirm" BOOLEAN NOT NULL DEFAULT false,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sites_filter" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "user_sites_filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_domain_filters" (
    "id" SERIAL NOT NULL,
    "domains" TEXT[],
    "userId" INTEGER,

    CONSTRAINT "user_domain_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "expiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "value" VARCHAR(100) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "phoneNumber" VARCHAR(100),
    "organization" TEXT NOT NULL DEFAULT E'KMC Community',
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" SERIAL NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phoneNumber" VARCHAR(100) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "company" VARCHAR(100) NOT NULL,
    "isClear" BOOLEAN NOT NULL DEFAULT true,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_sub_emails" (
    "id" SERIAL NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "email" VARCHAR(100) NOT NULL,

    CONSTRAINT "visitor_sub_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_status" (
    "id" SERIAL NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "visitId" INTEGER,
    "status" VARCHAR(100) NOT NULL,
    "isClear" BOOLEAN NOT NULL,
    "isClearedById" INTEGER,
    "dateCleared" DATE,
    "timeCleared" TIMESTAMPTZ,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_notes" (
    "id" SERIAL NOT NULL,
    "note" TEXT NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "authorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temperature_tags" (
    "id" SERIAL NOT NULL,
    "tag" VARCHAR(100) NOT NULL,

    CONSTRAINT "temperature_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_temp_check_list" (
    "id" SERIAL NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "tempTagId" INTEGER,
    "visitorId" INTEGER NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_temp_check_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" SERIAL NOT NULL,
    "visitId" TEXT NOT NULL,
    "guest" BOOLEAN NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "siteId" INTEGER,
    "floorId" INTEGER,
    "workTypeId" INTEGER,
    "leaveTypeId" INTEGER,
    "poc" VARCHAR(100),
    "pocEmail" VARCHAR(100),
    "purposeOfVisit" TEXT,
    "travelLocations" TEXT[],
    "healthTagId" INTEGER NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answers" VARCHAR(100)[],
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clearance" (
    "id" SERIAL NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "clearanceUrl" VARCHAR(255),
    "uploadedById" INTEGER,
    "notes" TEXT NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clearance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_types" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "work_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_types" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(100) NOT NULL,

    CONSTRAINT "leave_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_tags" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "health_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "multiSelect" BOOLEAN NOT NULL DEFAULT false,
    "critical" BOOLEAN NOT NULL DEFAULT true,
    "questionOrder" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "dateFrom" DATE NOT NULL,
    "dateTo" DATE NOT NULL,
    "time" TIMESTAMPTZ NOT NULL,
    "siteId" INTEGER,
    "floorId" INTEGER,
    "contactPerson" VARCHAR(100) NOT NULL,
    "contactEmail" VARCHAR(100) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "siteId" INTEGER NOT NULL,
    "siteName" VARCHAR(100) NOT NULL,
    "siteEmail" VARCHAR(100) NOT NULL DEFAULT E'pica@kmc.solutions',

    CONSTRAINT "sites_pkey" PRIMARY KEY ("siteId")
);

-- CreateTable
CREATE TABLE "floors" (
    "floorId" INTEGER NOT NULL,
    "floor" VARCHAR(100) NOT NULL,

    CONSTRAINT "floors_pkey" PRIMARY KEY ("floorId")
);

-- CreateTable
CREATE TABLE "_PermissionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SiteToUserSiteFilter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AnswerToQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FloorToSite" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_profileId_key" ON "users"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordResetToken_key" ON "users"("passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "user_sites_filter_userId_key" ON "user_sites_filter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_domain_filters_userId_key" ON "user_domain_filters"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_label_key" ON "permissions"("label");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_value_key" ON "permissions"("value");

-- CreateIndex
CREATE UNIQUE INDEX "visitors_email_key" ON "visitors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_sub_emails_email_key" ON "visitor_sub_emails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_status_visitId_unique" ON "visitor_status"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "temperature_tags_tag_key" ON "temperature_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "visits_visitId_key" ON "visits"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "work_types_type_key" ON "work_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "leave_types_type_key" ON "leave_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "health_tags_tag_key" ON "health_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "answers_answer_key" ON "answers"("answer");

-- CreateIndex
CREATE UNIQUE INDEX "sites_siteName_key" ON "sites"("siteName");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToUser_AB_unique" ON "_PermissionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToUser_B_index" ON "_PermissionToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SiteToUserSiteFilter_AB_unique" ON "_SiteToUserSiteFilter"("A", "B");

-- CreateIndex
CREATE INDEX "_SiteToUserSiteFilter_B_index" ON "_SiteToUserSiteFilter"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnswerToQuestion_AB_unique" ON "_AnswerToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_AnswerToQuestion_B_index" ON "_AnswerToQuestion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FloorToSite_AB_unique" ON "_FloorToSite"("A", "B");

-- CreateIndex
CREATE INDEX "_FloorToSite_B_index" ON "_FloorToSite"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sites_filter" ADD CONSTRAINT "user_sites_filter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_domain_filters" ADD CONSTRAINT "user_domain_filters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_sub_emails" ADD CONSTRAINT "visitor_sub_emails_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_status" ADD CONSTRAINT "visitor_status_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_status" ADD CONSTRAINT "visitor_status_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_status" ADD CONSTRAINT "visitor_status_isClearedById_fkey" FOREIGN KEY ("isClearedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notes" ADD CONSTRAINT "visitor_notes_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notes" ADD CONSTRAINT "visitor_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_temp_check_list" ADD CONSTRAINT "visitor_temp_check_list_tempTagId_fkey" FOREIGN KEY ("tempTagId") REFERENCES "temperature_tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_temp_check_list" ADD CONSTRAINT "visitor_temp_check_list_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("siteId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("floorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_workTypeId_fkey" FOREIGN KEY ("workTypeId") REFERENCES "work_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "leave_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_healthTagId_fkey" FOREIGN KEY ("healthTagId") REFERENCES "health_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearance" ADD CONSTRAINT "clearance_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearance" ADD CONSTRAINT "clearance_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("siteId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("floorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteToUserSiteFilter" ADD FOREIGN KEY ("A") REFERENCES "sites"("siteId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteToUserSiteFilter" ADD FOREIGN KEY ("B") REFERENCES "user_sites_filter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToQuestion" ADD FOREIGN KEY ("A") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToQuestion" ADD FOREIGN KEY ("B") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FloorToSite" ADD FOREIGN KEY ("A") REFERENCES "floors"("floorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FloorToSite" ADD FOREIGN KEY ("B") REFERENCES "sites"("siteId") ON DELETE CASCADE ON UPDATE CASCADE;
