import { z } from "zod";

export const userSchema = z.object({
  name: z.string().nonempty("Поле должно быть заполнено"),
  lastname: z.string().nonempty("Поле должно быть заполнено"),
});

export type TUserSchema = z.infer<typeof userSchema>;
