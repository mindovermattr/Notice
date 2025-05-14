import { ETaskStatus } from "./Enums/ETaskStatus";
import { TAtachment } from "./TAtachment";
import { TTasklist } from "./TTasklist";

export type TTask = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: boolean;
  status: ETaskStatus;
  subtasks: []; //todo
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
