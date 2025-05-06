/*
  Warnings:

  - You are about to drop the `_TaskToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assign_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TaskToUser" DROP CONSTRAINT "_TaskToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaskToUser" DROP CONSTRAINT "_TaskToUser_B_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assign_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_TaskToUser";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assign_id_fkey" FOREIGN KEY ("assign_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
