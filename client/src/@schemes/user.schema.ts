import { z } from "zod";

export const userSchema = z.object({
  name: z.string().nonempty("Поле должно быть заполнено"),
  lastName: z.string().nonempty("Поле должно быть заполнено"),
  avatarUrl: z.string(),
});

export type TUserSchema = z.infer<typeof userSchema>;
