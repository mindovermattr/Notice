/*
  Warnings:

  - Added the required column `task_list_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubTask" ADD COLUMN     "priority" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "task_list_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ListTasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "history_id" INTEGER NOT NULL,

    CONSTRAINT "ListTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListHistory" (
    "id" SERIAL NOT NULL,
    "history" TEXT[],

    CONSTRAINT "ListHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListTasks_history_id_key" ON "ListTasks"("history_id");

-- AddForeignKey
ALTER TABLE "ListTasks" ADD CONSTRAINT "ListTasks_history_id_fkey" FOREIGN KEY ("history_id") REFERENCES "ListHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_task_list_id_fkey" FOREIGN KEY ("task_list_id") REFERENCES "ListTasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
