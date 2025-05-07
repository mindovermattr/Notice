import { TTask } from "@/@types/TTask";
import { AxiosError } from "axios";
import { protectedInstance } from "./instance";

export const createTask = async (
  listId: number,
  task: { title: string; description: string; dueDate: string }
) => {
  try {
    const resp = await protectedInstance.post<TTask>(
      `/tasklist/${listId}/tasks`,
      task
    );
    return resp;
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};
export const patchTask = async (taskId: number, task: Partial<TTask>) => {
  try {
    const resp = await protectedInstance.patch<TTask>(`/tasks/${taskId}`, task);
    return resp;
  } catch (error: unknown) {
    return error as AxiosError<{
      message: string | string[];
      statusCode: number;
    }>;
  }
};

// export const deleteTaskList = async (listId: number) => {
//   try {
//     const resp = await protectedInstance.delete<TTasklist>(
//       `tasklist/${listId}`
//     );
//     return resp;
//   } catch (error: unknown) {
//     return error as AxiosError<{
//       message: string | string[];
//       statusCode: number;
//     }>;
//   }
// };
