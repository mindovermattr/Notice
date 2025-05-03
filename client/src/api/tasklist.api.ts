import { AxiosError } from "axios";
import { protectedInstance } from "./instance";

export const getTaskLists = async (projectId: number) => {
  try {
    const resp = await protectedInstance(``);
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};

export const createTaskLists = async (projectId: number, title: string) => {
  try {
    const resp = await protectedInstance.post(`project/${projectId}/tasklist`, {
      title,
    });
    
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};
