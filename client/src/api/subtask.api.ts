import { TApiError } from "@/@types/TApi";
import { TSubtask, TUpdateSubtask } from "@/@types/TSubtask";
import { protectedInstance } from "./instance";

//tasks/:taskId/subtask"
export const createSubTask = async (taskId: number, title: string) => {
  try {
    const resp = await protectedInstance.post<TSubtask>(
      `/tasks/${taskId}/subtask`,
      { title }
    );
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
export const deleteSubTask = async (taskId: number) => {
  try {
    const resp = await protectedInstance.delete<TSubtask>(`/subtask/${taskId}`);
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
export const updateSubTask = async (
  taskId: number,
  updateBody: Partial<TUpdateSubtask>
) => {
  try {
    const resp = await protectedInstance.patch<TSubtask>(`/subtask/${taskId}`, {
      ...updateBody,
    });
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
