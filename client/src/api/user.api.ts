import { ERolesBack } from "@/@types/Enums/ERoles";
import { TApiError } from "@/@types/TApi";
import { TRole, TUser } from "@/@types/TUser";
import { AxiosProgressEvent } from "axios";
import { protectedInstance } from "./instance";

export const patchUserAvatar = async (
  formData: FormData,
  onProgressCb: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const resp = await protectedInstance.patchForm<TUser>(
      `user/avatar`,
      {
        file: formData.get("files"),
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => onProgressCb(progressEvent),
      }
    );
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
export const patchUser = async (user: Partial<TUser>) => {
  try {
    const resp = await protectedInstance.patch<TUser>(`user`, user);
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};

export const getUserRole = async (projectId: number) => {
  try {
    const resp = await protectedInstance.get<TUser>(
      `project/${projectId}/users`
    );
    return resp;
  } catch (error: unknown) {
    return error as TApiError;
  }
};




