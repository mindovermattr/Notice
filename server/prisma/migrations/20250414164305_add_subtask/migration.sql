/*
  Warnings:

  - Added the required column `task_id` to the `SubTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubTask" ADD COLUMN     "task_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
