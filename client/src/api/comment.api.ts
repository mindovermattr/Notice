import { TApiError } from "@/@types/TApi";
import { TCommentFindAll } from "@/@types/TComments";
import { protectedInstance } from "./instance";

export const createComment = async (taskId: number, comment: string) => {
  try {
    const response = await protectedInstance.post<TCommentFindAll>(
      `tasks/${taskId}/comments`,
      {
        comment,
      }
    );
    return response;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
