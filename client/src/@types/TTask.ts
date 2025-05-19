import { TColumnStatusValue } from "@/constants/kanban.constans";
import { TAtachment } from "./TAtachment";
import { TSubtask } from "./TSubtask";
import { TTasklist } from "./TTasklist";

export type TTask = {
  id: number;
  createdAt: string;
  title: string;
  description: string;
  due_date: string;
  priority: boolean;
  status: TColumnStatusValue;
  subtasks: TSubtask[]; //todo
  assign_user?: TUser;
  isCompleted: boolean;
};

export type TTaskGetApi = TTask & {
  task_list: TTasklist;
  attachments: (TAtachment & {
    user: TUser;
  })[];
  assign_user: TUser;
  createdAt: string;
};
