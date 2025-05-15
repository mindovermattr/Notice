import { TApiError } from "@/@types/TApi";
import { TSubtask } from "@/@types/TSubtask";
import { protectedInstance } from "./instance";

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
