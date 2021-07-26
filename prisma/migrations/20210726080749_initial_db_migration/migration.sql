-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT true,
    "registeredById" INTEGER,
    "passwordResetToken" TEXT,
    "passwordResetTokenExpire" TIMESTAMP(3),
    "passwordChangedAt" TIMESTAMP(3),
    "emailConfirm" BOOLEAN NOT NULL DEFAULT false,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "expiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_lock_status_logs" (
    "lockedUserId" INTEGER NOT NULL,
    "lockedById" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("lockedUserId","lockedById")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "organization" TEXT NOT NULL DEFAULT E'KMC Community',
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" SERIAL NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_status" (
    "id" SERIAL NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "visitId" INTEGER,
    "status" TEXT NOT NULL,
    "isClear" BOOLEAN NOT NULL,
    "isClearedById" INTEGER,
    "dateCleared" DATE,
    "timeCleared" TIMESTAMPTZ,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_notes" (
    "id" SERIAL NOT NULL,
    "note" TEXT NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temperature_tags" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_temp_check_list" (
    "id" SERIAL NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "tempTagId" INTEGER NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" SERIAL NOT NULL,
    "guest" BOOLEAN NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "siteId" INTEGER NOT NULL,
    "floorId" INTEGER NOT NULL,
    "workTypeId" INTEGER,
    "leaveTypeId" INTEGER,
    "poc" TEXT,
    "pocEmail" TEXT,
    "travelLocationId" INTEGER,
    "healthTagId" INTEGER NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clearance" (
    "id" SERIAL NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "clearanceUrl" TEXT,
    "notes" TEXT NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_types" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_types" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_tags" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "multiSelect" BOOLEAN NOT NULL DEFAULT false,
    "critical" BOOLEAN NOT NULL DEFAULT true,
    "questionOrder" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_locations" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "dateCreated" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "dateFrom" DATE NOT NULL,
    "dateTo" DATE NOT NULL,
    "time" TIMESTAMPTZ NOT NULL,
    "siteId" INTEGER NOT NULL,
    "floorId" INTEGER NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "siteId" INTEGER NOT NULL,
    "siteName" TEXT NOT NULL,

    PRIMARY KEY ("siteId")
);

-- CreateTable
CREATE TABLE "floors" (
    "floorId" INTEGER NOT NULL,
    "floor" TEXT NOT NULL,

    PRIMARY KEY ("floorId")
);

-- CreateTable
CREATE TABLE "_PermissionToUser" (
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
CREATE UNIQUE INDEX "users.profileId_unique" ON "users"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users.passwordResetToken_unique" ON "users"("passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "permissions.type_unique" ON "permissions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "visitors.email_unique" ON "visitors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_status_visitId_unique" ON "visitor_status"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "temperature_tags.tag_unique" ON "temperature_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "visits_travelLocationId_unique" ON "visits"("travelLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "work_types.type_unique" ON "work_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "leave_types.type_unique" ON "leave_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "health_tags.tag_unique" ON "health_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "answers.answer_unique" ON "answers"("answer");

-- CreateIndex
CREATE UNIQUE INDEX "sites.siteName_unique" ON "sites"("siteName");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToUser_AB_unique" ON "_PermissionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToUser_B_index" ON "_PermissionToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnswerToQuestion_AB_unique" ON "_AnswerToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_AnswerToQuestion_B_index" ON "_AnswerToQuestion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FloorToSite_AB_unique" ON "_FloorToSite"("A", "B");

-- CreateIndex
CREATE INDEX "_FloorToSite_B_index" ON "_FloorToSite"("B");

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY ("profileId") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY ("registeredById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lock_status_logs" ADD FOREIGN KEY ("lockedUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lock_status_logs" ADD FOREIGN KEY ("lockedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_status" ADD FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_status" ADD FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_status" ADD FOREIGN KEY ("isClearedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notes" ADD FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notes" ADD FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_temp_check_list" ADD FOREIGN KEY ("tempTagId") REFERENCES "temperature_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_temp_check_list" ADD FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD FOREIGN KEY ("siteId") REFERENCES "sites"("siteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD FOREIGN KEY ("floorId") REFERENCES "floors"("floorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD FOREIGN KEY ("workTypeId") REFERENCES "work_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD FOREIGN KEY ("leaveTypeId") REFERENCES "leave_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD FOREIGN KEY ("travelLocationId") REFERENCES "travel_locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD FOREIGN KEY ("healthTagId") REFERENCES "health_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearance" ADD FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD FOREIGN KEY ("siteId") REFERENCES "sites"("siteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD FOREIGN KEY ("floorId") REFERENCES "floors"("floorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToQuestion" ADD FOREIGN KEY ("A") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToQuestion" ADD FOREIGN KEY ("B") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FloorToSite" ADD FOREIGN KEY ("A") REFERENCES "floors"("floorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FloorToSite" ADD FOREIGN KEY ("B") REFERENCES "sites"("siteId") ON DELETE CASCADE ON UPDATE CASCADE;
