import { api } from "@/api/axios";

import type { ApiResponse, SimpleLoginRequest, SimpleLoginResponse } from "@/types/auth";

export const simpleLogin = async (body: SimpleLoginRequest): Promise<SimpleLoginResponse> => {
  const response = await api.post<ApiResponse<SimpleLoginResponse>>(
    "/api/v1/users/simple-login",
    body,
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }

  return response.data.data;
};
