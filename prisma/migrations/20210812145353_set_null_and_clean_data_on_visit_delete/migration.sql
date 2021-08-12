-- DropForeignKey
ALTER TABLE "clearance" DROP CONSTRAINT "clearance_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_floorId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_siteId_fkey";

-- DropForeignKey
ALTER TABLE "visitor_notes" DROP CONSTRAINT "visitor_notes_authorId_fkey";

-- DropForeignKey
ALTER TABLE "visitor_notes" DROP CONSTRAINT "visitor_notes_visitorId_fkey";

-- DropForeignKey
ALTER TABLE "visitor_status" DROP CONSTRAINT "visitor_status_visitId_fkey";

-- DropForeignKey
ALTER TABLE "visitor_temp_check_list" DROP CONSTRAINT "visitor_temp_check_list_tempTagId_fkey";

-- AlterTable
ALTER TABLE "clearance" ALTER COLUMN "uploadedById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "siteId" DROP NOT NULL,
ALTER COLUMN "floorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "visitor_notes" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "visitor_temp_check_list" ALTER COLUMN "tempTagId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "visitor_status" ADD FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notes" ADD FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notes" ADD FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_temp_check_list" ADD FOREIGN KEY ("tempTagId") REFERENCES "temperature_tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearance" ADD FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD FOREIGN KEY ("siteId") REFERENCES "sites"("siteId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD FOREIGN KEY ("floorId") REFERENCES "floors"("floorId") ON DELETE SET NULL ON UPDATE CASCADE;
