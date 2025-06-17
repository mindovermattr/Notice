import { TLoginSchema, TRegistrationSchema } from "@/@schemes/auth.schema";
import { ERoles } from "@/@types/Enums/ERoles";
import { TApiError } from "@/@types/TApi";
import { TUser } from "@/@types/TUser";
import { instance } from "./instance";

export type TRespAuth = {
  user: TUser;
  token: string;
  role?: ERoles;
};

export const registration = async ({
  email,
  password,
  confirmPassword,
  lastname,
  name,
}: TRegistrationSchema) => {
  try {
    const response = await instance.post<TRespAuth>(`auth/registration`, {
      email,
      password,
      confirmPassword,
      lastname,
      name,
    });

    return response;
  } catch (error: unknown) {
    return error as TApiError;
  }
};

export const login = async ({ email, password }: TLoginSchema) => {
  try {
    const response = await instance.post<TRespAuth>(`auth/login`, {
      email,
      password,
    });
    return response;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
