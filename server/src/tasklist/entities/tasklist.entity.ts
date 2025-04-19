import { ListTasks } from "@prisma/client";

export class Tasklist implements ListTasks {
  history_id: number;
  id: number;
  title: string;
}
