-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_floorId_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_siteId_fkey";

-- AlterTable
ALTER TABLE "visits" ALTER COLUMN "siteId" DROP NOT NULL,
ALTER COLUMN "floorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "visits" ADD FOREIGN KEY ("siteId") REFERENCES "sites"("siteId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD FOREIGN KEY ("floorId") REFERENCES "floors"("floorId") ON DELETE SET NULL ON UPDATE CASCADE;
