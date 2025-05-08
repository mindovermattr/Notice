import { Task as TaskScheme } from "@prisma/client";

export class Task implements TaskScheme {
  task_list_id: number;
  createdAt: Date;
  description: string;
  due_date: Date;
  id: number;
  priority: boolean;
  title: string;
  updatedAt: Date;
  status: string;
  assign_id: number;
  isCompleted: boolean;
}
