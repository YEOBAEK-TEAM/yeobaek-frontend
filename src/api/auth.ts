import { api } from "@/api/axios";

import type { ApiResponse, LoginRequest, LoginResponse } from "@/types/auth";

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>("/api/v1/users/login", body);

  return response.data.data;
};
