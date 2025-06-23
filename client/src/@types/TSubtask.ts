export type TSubtask = {
  id: number;
  createdAt: string;
  title: string;
  task_id: number;
  isCompleted: boolean;
};

export type TUpdateSubtask = Pick<TSubtask, "isCompleted" | "title">;
