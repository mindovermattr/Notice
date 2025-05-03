/*
  Warnings:

  - You are about to drop the column `project_id` on the `Task` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `ListTasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_project_id_fkey";

-- AlterTable
ALTER TABLE "ListTasks" ADD COLUMN     "project_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "project_id";

-- AddForeignKey
ALTER TABLE "ListTasks" ADD CONSTRAINT "ListTasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
