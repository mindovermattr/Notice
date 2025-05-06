-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_task_list_id_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_task_list_id_fkey" FOREIGN KEY ("task_list_id") REFERENCES "ListTasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
