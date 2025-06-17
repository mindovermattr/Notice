import { ERolesBack } from "./Enums/ERoles";

export type TUser = {
  id: number;
  email: string;
  name: string;
  lastname: string;
  avatarUrl?: string;
};

export type TRole = {
  id: number;
  project_id: number;
  role_id: ERolesBack;
  user_id: number;
};
