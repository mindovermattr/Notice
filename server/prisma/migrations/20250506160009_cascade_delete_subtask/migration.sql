-- DropForeignKey
ALTER TABLE "SubTask" DROP CONSTRAINT "SubTask_task_id_fkey";

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
