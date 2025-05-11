import { TApiError } from "@/@types/TApi";
import { instance } from "./instance";

export const getFile = async (fileName: string) => {
  try {
    const response = await instance.get(`yandex-disk/file/${fileName}`, {
      responseType: "blob",
    });
    return response;
  } catch (error: unknown) {
    return error as TApiError;
  }
};
