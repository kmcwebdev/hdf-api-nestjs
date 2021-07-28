/*
  Warnings:

  - The primary key for the `user_lock_status_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "user_lock_status_logs" DROP CONSTRAINT "user_lock_status_logs_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD PRIMARY KEY ("id");
