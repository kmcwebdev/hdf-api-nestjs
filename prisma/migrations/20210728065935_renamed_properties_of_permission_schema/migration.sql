/*
  Warnings:

  - You are about to drop the column `type` on the `permissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[label]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "permissions.type_unique";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "type",
ADD COLUMN     "label" VARCHAR(100) NOT NULL,
ADD COLUMN     "value" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "permissions.label_unique" ON "permissions"("label");

-- CreateIndex
CREATE UNIQUE INDEX "permissions.value_unique" ON "permissions"("value");
