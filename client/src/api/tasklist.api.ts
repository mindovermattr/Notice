import { TTasklist } from "@/@types/TTasklist";
import { AxiosError } from "axios";
import { protectedInstance } from "./instance";

export const getTaskLists = async (projectId: number) => {
  try {
    const resp = await protectedInstance.get<TTasklist[]>(
      `project/${projectId}/tasklist`
    );
    return resp;
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};

export const createTaskList = async (projectId: number, title: string) => {
  try {
    const resp = await protectedInstance.post<TTasklist>(
      `project/${projectId}/tasklist`,
      {
        title,
      }
    );
    return resp;
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};

export const deleteTaskList = async (listId: number) => {
  try {
    const resp = await protectedInstance.delete<TTasklist>(
      `tasklist/${listId}`
    );
    return resp;
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};
