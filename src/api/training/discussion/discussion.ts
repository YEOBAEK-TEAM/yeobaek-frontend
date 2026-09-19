import { api } from "@/api/axios";

import type { ApiResponse } from "@/types/auth";
import type {
  DiscussionRoomMainResponse,
  MainSectionType,
} from "@/types/training/discussion/discussion";

// 메인 섹션별 조회, HOT 10 / NEW 5 / MY / APPLY
const getMainSection = async (
  type: MainSectionType,
  signal?: AbortSignal,
): Promise<DiscussionRoomMainResponse[]> => {
  const response = await api.get<ApiResponse<DiscussionRoomMainResponse[]>>(
    "/api/v1/discussion-rooms/main",
    { params: { type }, signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getHotGroups = (signal?: AbortSignal) => getMainSection("HOT", signal);

export const getNewGroups = (signal?: AbortSignal) => getMainSection("NEW", signal);

// 참여 중인 토론 카드와 내 그룹 탭이 함께 사용
export const getMyGroups = (signal?: AbortSignal) => getMainSection("MY", signal);

export const getPendingGroups = (signal?: AbortSignal) => getMainSection("APPLY", signal);
