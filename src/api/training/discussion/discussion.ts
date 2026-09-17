import {
  mockActiveDiscussions,
  mockHotGroups,
  mockMyGroups,
  mockNewGroups,
  mockPendingGroups,
  mockSearchableGroups,
} from "@/mocks/training/discussion/discussion";

import type {
  ActiveDiscussionResponse,
  DiscussionGroupResponse,
} from "@/types/training/discussion/discussion";

// 참여 중인 토론방 조회
export const getActiveDiscussions = async (): Promise<ActiveDiscussionResponse[]> => {
  return mockActiveDiscussions;
};

// HOT 10 그룹 조회
export const getHotGroups = async (): Promise<DiscussionGroupResponse[]> => {
  return mockHotGroups;
};

// 오늘 생성된 그룹 조회
export const getNewGroups = async (): Promise<DiscussionGroupResponse[]> => {
  return mockNewGroups;
};

// 내 그룹 조회
export const getMyGroups = async (): Promise<DiscussionGroupResponse[]> => {
  return mockMyGroups;
};

// 가입 신청한 그룹 조회
export const getPendingGroups = async (): Promise<DiscussionGroupResponse[]> => {
  return mockPendingGroups;
};

// 책 제목, 저자, 방장 이름 기준 그룹 검색
export const searchGroups = async (keyword: string): Promise<DiscussionGroupResponse[]> => {
  const normalized = keyword.toLowerCase();

  return mockSearchableGroups.filter((group) =>
    [group.bookTitle, group.author, group.hostNickname].some((value) =>
      value.toLowerCase().includes(normalized),
    ),
  );
};
