import { Project as ProjectSchema } from '@prisma/client';

export class Project implements ProjectSchema {
  author_id: number;
  id: number;
  name: string;
}
