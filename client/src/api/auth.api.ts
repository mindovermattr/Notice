import { TLoginSchema, TRegistrationSchema } from "@/@schemes/auth.schema";
import { AxiosError } from "axios";
import { instance } from "./instance";

export type TRespAuth = {
  user: TUser;
  token: string;
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
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
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
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};
