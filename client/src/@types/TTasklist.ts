import { TTask } from "./TTask";

export type TTasklist = {
  id: number;
  title: string;
  tasks: TTask[];
  history: {
    history: string[];
  };
};
