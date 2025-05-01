import { AxiosError } from "axios";
import { protectedInstance } from "./instance";

export const getTaskLists = async (id: number) => {
  try {
    const resp = await protectedInstance('')
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};
