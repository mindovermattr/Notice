import { User } from "@prisma/client";
import { Role } from "src/enums/roles";

export class UserEntity implements User {
  id: number;
  email: string;
  password: string;
  name: string;
  lastname: string;
  role: Role;
 avatarUrl: string;
}
