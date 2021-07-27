/*
  Warnings:

  - Added the required column `uploadedById` to the `clearance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clearance" ADD COLUMN     "uploadedById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "clearance" ADD FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
