import { z } from "zod";

export const subtaskSchema = z.object({
  title: z.string().min(4, "Поле должно состоять минимум из 4х символов"),
});
