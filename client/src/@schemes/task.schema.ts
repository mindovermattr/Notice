import { z } from "zod";

// Создаем схему валидации с Zod
const dateSchema = z
  .string()
  .regex(/^\d{2}.\d{2}.\d{4}$/, {
    message: "Дата должна быть в формате ДД.ММ.ГГГГ",
  })
  .refine(
    (value) => {
      const [day, month, year] = value.split(".").map(Number);

      // Проверяем корректность даты
      if (month < 1 || month > 12) return false;

      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    },
    {
      message: "Некорректная дата",
    }
  );

export const taskSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().min(8, "Минимум 8 символов"),
  dueDate: dateSchema,
  userId: z.string().transform((value) => +value),
});
