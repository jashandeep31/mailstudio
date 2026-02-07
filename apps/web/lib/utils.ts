import { isAxiosError } from "axios";

export const getAxiosError = (error: unknown): string => {
  if (isAxiosError(error) && error?.response?.data.message) {
    return error.response.data.message;
  } else {
    return "Something went wrong ";
  }
};
