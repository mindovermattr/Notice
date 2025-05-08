import { z } from "zod";

const dateSchema = z
  .string()
  .regex(/^\d{2}.\d{2}.\d{4}$/, {
    message: "Дата должна быть в формате ДД.ММ.ГГГГ",
  })
  .refine(
    (value) => {
      const [day, month, year] = value.split(".").map(Number);

      if (month < 1 || month > 12) return false;

      const date = new Date(year, month - 1, day);
      const isValidDate =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

      if (!isValidDate) return false;

      const today = new Date();

      return date >= today;
    },
    {
      message: "Дата должна быть корректной и не раньше завтрашнего дня",
    }
  );

const timeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}/, {
    message: "Время должно быть в формате ЧЧ:ММ",
  })
  .refine(
    (val) => {
      const [hours, minutes] = val.split(":").map(Number);
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    },
    {
      message: "Некорректное время: часы должны быть 00-23, минуты 00-59",
    }
  );

export const taskSchema = z
  .object({
    title: z.string().nonempty("Название не должно быть пустым"),
    description: z.string().min(8, "Минимум 8 символов"),
    dateTime: dateSchema,
    time: timeSchema,
    userId: z.string().transform((value) => +value),
  })
  .transform((data) => {
    const [day, month, year] = data.dateTime.split(".").map(Number);
    const [hours, minutes] = data.time.split(":").map(Number);
    const dueDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

    return {
      ...data,
      dueDate,
    };
  });
