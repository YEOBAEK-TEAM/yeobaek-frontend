import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getHotGroups,
  getMyGroups,
  getNewGroups,
  getPendingGroups,
} from "@/api/training/discussion/discussion";
import { getRooms } from "@/api/training/discussion/room";
import {
  toActiveDiscussionView,
  toDiscussionGroupViews,
  toSearchGroupViews,
} from "@/utils/training/discussion/toDiscussionView";

import type {
  DiscussionGroupListId,
  DiscussionRoomMainResponse,
} from "@/types/training/discussion/discussion";
import type { DiscussionRoomResponse, PageResponse } from "@/types/training/discussion/room";

const STALE_TIME = 30_000;

// 토론장 query key 팩토리
export const discussionKeys = {
  all: ["trainings", "discussion"] as const,
  groups: (listId: DiscussionGroupListId) => [...discussionKeys.all, "groups", listId] as const,
  search: (keyword: string) => [...discussionKeys.all, "search", keyword] as const,
};

// 참여 중인 토론 카드와 내 그룹 탭이 같은 캐시를 공유
const myGroupsQuery = {
  queryKey: discussionKeys.groups("joined"),
  queryFn: ({ signal }: { signal: AbortSignal }) => getMyGroups(signal),
  staleTime: STALE_TIME,
  refetchOnMount: "always",
} as const;

const selectGroups = (responses: DiscussionRoomMainResponse[]) => toDiscussionGroupViews(responses);

export const useActiveDiscussion = () =>
  useQuery({ ...myGroupsQuery, select: toActiveDiscussionView });

// 토론방 소켓 연동 시 참여 인원·HOT 순위 실시간 반영 지점
export const useHotGroups = () =>
  useQuery({
    queryKey: discussionKeys.groups("hot"),
    queryFn: ({ signal }) => getHotGroups(signal),
    select: selectGroups,
    staleTime: STALE_TIME,
    refetchOnMount: "always",
  });

export const useNewGroups = () =>
  useQuery({
    queryKey: discussionKeys.groups("new"),
    queryFn: ({ signal }) => getNewGroups(signal),
    select: selectGroups,
    staleTime: STALE_TIME,
    refetchOnMount: "always",
  });

// 승인되어 옮겨온 방을 바로 보이도록 탭 진입마다 재조회
export const useMyGroups = () => useQuery({ ...myGroupsQuery, select: selectGroups });

// 승인 결과 알림 연동 전까지 탭 진입마다 재조회
export const usePendingGroups = () =>
  useQuery({
    queryKey: discussionKeys.groups("pending"),
    queryFn: ({ signal }) => getPendingGroups(signal),
    select: selectGroups,
    staleTime: STALE_TIME,
    refetchOnMount: "always",
  });

const selectSearchGroups = (page: PageResponse<DiscussionRoomResponse>) =>
  toSearchGroupViews(page.items);

export const useSearchGroups = (keyword: string) =>
  useQuery({
    queryKey: discussionKeys.search(keyword),
    queryFn: ({ signal }) => getRooms({ filter: "all", keyword, page: 0, signal }),
    select: selectSearchGroups,
    enabled: keyword.length > 0,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
