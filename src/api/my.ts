import { api } from "@/api/axios";
import type { ApiResponse } from "@/types/auth";
import type { MyPageParams, MyPageResponse } from "@/types/my";

export const getMyPage = async (params: MyPageParams = {}, signal?: AbortSignal) => {
  const response = await api.get<ApiResponse<MyPageResponse>>("/api/v1/mypage", { params, signal });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.patch<ApiResponse<string>>("/api/v1/users/img", formData, {
    // Override the instance's JSON default; the browser supplies the multipart boundary.
    headers: { "Content-Type": undefined },
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
