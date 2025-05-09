import { SubTask as SubTaskSchema } from "@prisma/client";

export class Subtask implements SubTaskSchema {
  id: number;
  createdAt: Date;
  task_id: number;
  title: string;
  updatedAt: Date;
}
