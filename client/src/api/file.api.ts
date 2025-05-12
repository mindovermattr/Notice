import { TApiError } from "@/@types/TApi";
import { AxiosProgressEvent } from "axios";
import { protectedInstance } from "./instance";

export const getFile = async (fileName: string) => {
  try {
    const response = await protectedInstance.get(
      `yandex-disk/file/${fileName}`,
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error: unknown) {
    return error as TApiError;
  }
};

export const uploadFile = async (formData: FormData) => {
  try {
    const response = await protectedInstance.post(`yandex-disk`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
export const uploadMultipleFile = async (
  formData: FormData,
  onProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const response = await protectedInstance.post(
      `yandex-disk/upload-multiple`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => onProgress(progressEvent),
      }
    );
    return response.data;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
