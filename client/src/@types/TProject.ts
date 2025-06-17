import { ERoles } from "./Enums/ERoles";
import { TRole, TUser } from "./TUser";

export type TProject = {
  id: number;
  name: string;
  author_id: number;
  users: (TUser & { role: TRole })[];
};

export type TProjectApi = TProject & {
  role: ERoles;
};
