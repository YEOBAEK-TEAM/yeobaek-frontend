import { isAxiosError } from "axios";

// 서버가 내려준 안내 문구 우선, 없으면 기본 문구
export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<{ message?: string }>(error)) return error.response?.data?.message || fallback;
  if (error instanceof Error && error.message) return error.message;

  return fallback;
};

export const getApiErrorStatus = (error: unknown) =>
  isAxiosError(error) ? error.response?.status : undefined;
