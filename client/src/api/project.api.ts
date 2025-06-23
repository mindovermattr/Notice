import { ERolesBack } from "@/@types/Enums/ERoles";
import { TApiError } from "@/@types/TApi";
import { TProject, TProjectApi } from "@/@types/TProject";
import { TRole } from "@/@types/TUser";
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

export const changeUserRole = async ({
  projectId,
  role,
  userId,
}: {
  projectId: number;
  userId: number;
  role: ERolesBack;
}) => {
  try {
    const resp = await protectedInstance.patch<TRole>(
      `project/${projectId}/users`,
      {
        id: userId,
        role,
      }
    );
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};

export const deleteUserFromProject = async ({
  projectId,
  userId,
}: {
  projectId: number;
  userId: number;
}) => {
  try {
    const resp = await protectedInstance.delete<TRole>(
      `project/${projectId}/users/${userId}`
    );
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};

export const deleteProject = async ({ id }: { id: number }) => {
  try {
    const resp = await protectedInstance.delete<TProjectApi>(`project/${id}`);
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
export const getProjectRole = async ({ id, userId }: { id: number, userId:number }) => {
  try {
    const resp = await protectedInstance.get<TProjectApi>(
      `project/${id}/users/${userId}`
    );
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
