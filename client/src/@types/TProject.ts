import { ERoles } from "./Enums/ERoles";

export type TProject = {
  id: number;
  name: string;
  author_id: number;
  users: TUser[];
};

export type TProjectApi = TProject & {
  role: ERoles;
};
