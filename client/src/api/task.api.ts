import { TApiError } from "@/@types/TApi";
import { TCommentFindAll } from "@/@types/TComments";
import { TTask, TTaskGetApi } from "@/@types/TTask";
import { protectedInstance } from "./instance";

export const createTask = async (
  listId: number,
  task: { title: string; description: string; dueDate: Date; userId: number }
) => {
  try {
    const resp = await protectedInstance.post<TTask>(
      `/tasklist/${listId}/tasks`,
      task
    );
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
export const patchTask = async (taskId: number, task: Partial<TTask>) => {
  try {
    const resp = await protectedInstance.patch<TTask>(`/tasks/${taskId}`, task);
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};

export const getTask = async (taskId: number) => {
  try {
    const resp = await protectedInstance.get<TTaskGetApi>(`/tasks/${taskId}`);
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
export const getTaskComments = async (taskId: number) => {
  try {
    const resp = await protectedInstance.get<TCommentFindAll[]>(
      `/tasks/${taskId}/comments`
    );
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
