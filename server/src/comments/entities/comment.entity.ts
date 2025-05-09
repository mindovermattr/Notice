import { Comments as CommentsSchema } from "@prisma/client";

export class Comment implements CommentsSchema {
  id: number;
  createdAt: Date;
  task_id: number;
  updatedAt: Date;
  comment: string;
}
