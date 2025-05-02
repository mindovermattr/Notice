import { TProject } from "@/@types/TProject";
import { AxiosError } from "axios";
import { protectedInstance } from "./instance";

export const getAllProjects = async () => {
  try {
    const resp = await protectedInstance.get<TProject[]>("project/all");

    return resp;
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};

export const createProject = async ({ name }: { name: string }) => {
  try {
    const resp = await protectedInstance.post<TProject[]>("project", { name });

    return resp;
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};
