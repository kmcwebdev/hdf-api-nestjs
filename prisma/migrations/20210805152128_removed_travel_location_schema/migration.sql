/*
  Warnings:

  - You are about to drop the column `travelLocationId` on the `visits` table. All the data in the column will be lost.
  - You are about to drop the `travel_locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_travelLocationId_fkey";

-- DropIndex
DROP INDEX "visits_travelLocationId_unique";

-- AlterTable
ALTER TABLE "visits" DROP COLUMN "travelLocationId",
ADD COLUMN     "travelLocations" TEXT[];

-- DropTable
DROP TABLE "travel_locations";
