
import { AxiosError } from "axios";
import { protectedInstance } from "./instance";

export const getProjects = async () => {
  try {
    const resp = await protectedInstance('project/all')
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};
