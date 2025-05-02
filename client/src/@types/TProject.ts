import { ERoles } from "./Enums/ERoles";

export type TProject = {
  id: number;
  name: string;
  author_id: number;
};

export type TProjectApi = TProject & {
  user: TUser[];
  role: ERoles;
};
