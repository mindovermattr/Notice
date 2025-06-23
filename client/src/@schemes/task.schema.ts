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

export const taskSchema = z.object({
  title: z.string().nonempty("Название не должно быть пустым"),
  description: z.string().min(8, "Минимум 8 символов"),
  dateTime: dateSchema,
  time: timeSchema,
  userId: z.string().transform((value) => +value),
});

export const taskCreateSchema = taskSchema.transform((data) => {
  const [day, month, year] = data.dateTime.split(".").map(Number);
  const [hours, minutes] = data.time.split(":").map(Number);
  const dueDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  return {
    ...data,
    dueDate,
  };
});

export const editTaskSchema = taskSchema.pick({
  title: true,
  description: true,
});

const dateTimeSchema = z
  .string()
  .nonempty("Поле не должно быть пустым")
  .regex(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/, {
    message: "Дата и время должны быть в формате ДД.ММ.ГГГГ ЧЧ:ММ",
  })
  .refine(
    (value) => {
      if (typeof value !== "string") return false;

      const parts = value.split(" ");
      if (parts.length !== 2) return false;

      const [datePart, timePart] = parts;
      const dateParts = datePart.split(".");
      if (dateParts.length !== 3) return false;
      const [day, month, year] = dateParts.map(Number);

      const timeParts = timePart.split(":");
      if (timeParts.length !== 2) return false;
      const [hours, minutes] = timeParts.map(Number);

      if (
        !Number.isInteger(day) ||
        !Number.isInteger(month) ||
        !Number.isInteger(year) ||
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes)
      ) {
        return false;
      }

      if (month < 1 || month > 12) return false;
      if (hours < 0 || hours > 23) return false;
      if (minutes < 0 || minutes > 59) return false;

      const inputDate = new Date(
        Date.UTC(year, month - 1, day, hours, minutes)
      );

      const isValidDate =
        inputDate.getUTCFullYear() === year &&
        inputDate.getUTCMonth() === month - 1 &&
        inputDate.getUTCDate() === day &&
        inputDate.getUTCHours() === hours &&
        inputDate.getUTCMinutes() === minutes;

      if (!isValidDate) return false;

      const nowUTC = new Date();

      return inputDate.getTime() >= nowUTC.getTime();
    },
    {
      message: "Дата и время должны быть не раньше текущего момента (UTC)",
    }
  )
  .transform((data) => {
    const parts = data.split(" ");
    const [datePart, timePart] = parts;
    const [day, month, year] = datePart.split(".").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    const dueDate = new Date(year, month - 1, day, hours, minutes);

    return dueDate;
  });

export const updateTaskSchema = z.object({
  due_date: dateTimeSchema,
  createdAt: dateTimeSchema,
  assign_id: z.string(),
});
