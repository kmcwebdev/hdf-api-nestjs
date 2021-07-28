/*
  Warnings:

  - You are about to drop the `user_lock_status_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_lock_status_logs" DROP CONSTRAINT "user_lock_status_logs_lockedById_fkey";

-- DropForeignKey
ALTER TABLE "user_lock_status_logs" DROP CONSTRAINT "user_lock_status_logs_lockedUserId_fkey";

-- DropTable
DROP TABLE "user_lock_status_logs";
