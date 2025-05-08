import { AxiosError } from "axios";

export type TApiError = AxiosError<{
  message: string | string[];
  statusCode: number;
}>;
