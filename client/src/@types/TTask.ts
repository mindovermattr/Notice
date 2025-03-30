import { ETaskStatus } from "./Enums/ETaskStatus";

export type TTask = {
  id: string;
  title: string;
  description: string;
  status: ETaskStatus;
  taskName: "space task";
  subtasks: [];
  attachments: 6;
  imgUrl: "";
  expiredAt: "12-12-2025";
};
