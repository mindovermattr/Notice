import { ETaskStatus } from "./Enums/ETaskStatus";

export type TTask = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: boolean;
  status: ETaskStatus;
  subtasks: []; //todo
  assign_user?: TUser;
};
