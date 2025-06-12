import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Введенная почта не соответствует формату" })
      .nonempty({ message: "Необходимо ввести почту" }),
    password: z.string().min(5, "Пароль должен состоять минимум из 5 символов"),
  })
  .strict();

export const registrationSchema = loginSchema
  .extend({
    name: z
      .string()
      .nonempty()
      .refine((val) => !/[0-9]/.test(val), {
        message: "Строка не должна содержать цифр",
      }),
    lastname: z
      .string()
      .nonempty()
      .refine((val) => !/[0-9]/.test(val), {
        message: "Строка не должна содержать цифр",
      }),
    confirmPassword: z
      .string()
      .min(5, "Подтверждение пароля должно состоять минимум из 5 символов"),
  })
  .refine((obj) => obj.password === obj.confirmPassword, {
    message: "Пароли должны совпадать",
    path: ["confirmPassword"],
  });

export type TLoginSchema = z.infer<typeof loginSchema>;
export type TRegistrationSchema = z.infer<typeof registrationSchema>;
