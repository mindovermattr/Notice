import { z } from "zod";

export const subtaskSchema = z.object({
  title: z.string().nonempty("Поле должно быть заполнено"),
});
