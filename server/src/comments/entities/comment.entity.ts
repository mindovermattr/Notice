import { Comment as CommentSchema } from "@prisma/client";

export class Comment implements CommentSchema {
  id: number;
  createdAt: Date;
  task_id: number;
  updatedAt: Date;
  comment: string;
  user_id: number;
}
