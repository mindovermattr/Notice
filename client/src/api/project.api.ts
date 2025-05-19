import { TApiError } from "@/@types/TApi";
import { TProject, TProjectApi } from "@/@types/TProject";
import { protectedInstance } from "./instance";

export const getAllProjects = async () => {
  try {
    const resp = await protectedInstance.get<TProject[]>("project/all");
  return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};

export const createProject = async ({ name }: { name: string }) => {
  try {
    const resp = await protectedInstance.post<TProject>("project", { name });
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
export const addUserToProject = async (projectId: number, email: string) => {
  try {
    const resp = await protectedInstance.post<TProject>(
      `project/${projectId}/users`,
      { email }
    );
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};

export const getProjectById = async ({ id }: { id: number }) => {
  try {
    const resp = await protectedInstance.post<TProjectApi>(`project/${id}`);
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
