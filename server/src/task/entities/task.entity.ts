import { Task as TaskScheme } from '@prisma/client';

export class Task implements TaskScheme {
  createdAt: Date;
  description: string;
  due_date: Date;
  id: number;
  priority: boolean;
  project_id: number;
  title: string;
  updatedAt: Date;
}
