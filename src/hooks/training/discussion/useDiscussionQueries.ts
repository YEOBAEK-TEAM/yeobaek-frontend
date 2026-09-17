import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getActiveDiscussions,
  getHotGroups,
  getMyGroups,
  getNewGroups,
  getPendingGroups,
  searchGroups,
} from "@/api/training/discussion/discussion";
import {
  toActiveDiscussionView,
  toDiscussionGroupViews,
} from "@/utils/training/discussion/toDiscussionView";

import type {
  DiscussionGroupListId,
  DiscussionGroupResponse,
} from "@/types/training/discussion/discussion";

const STALE_TIME = 30_000;

// 이미 참여 중인 방은 추천 목록에서 제외, 승인 반영을 위해 탭 진입마다 재조회
const selectRecommendGroups = (responses: DiscussionGroupResponse[]) =>
  toDiscussionGroupViews(responses).filter((group) => group.variant !== "joined");

// 토론장 query key 팩토리
export const discussionKeys = {
  all: ["trainings", "discussion"] as const,
  active: () => [...discussionKeys.all, "active"] as const,
  groups: (listId: DiscussionGroupListId) => [...discussionKeys.all, "groups", listId] as const,
  search: (keyword: string) => [...discussionKeys.all, "search", keyword] as const,
};

export const useActiveDiscussion = () =>
  useQuery({
    queryKey: discussionKeys.active(),
    queryFn: getActiveDiscussions,
    select: toActiveDiscussionView,
    staleTime: STALE_TIME,
  });

// 토론방 소켓 연동 시 참여 인원·HOT 순위 실시간 반영 지점
export const useHotGroups = () =>
  useQuery({
    queryKey: discussionKeys.groups("hot"),
    queryFn: getHotGroups,
    select: selectRecommendGroups,
    staleTime: STALE_TIME,
    refetchOnMount: "always",
  });

export const useNewGroups = () =>
  useQuery({
    queryKey: discussionKeys.groups("new"),
    queryFn: getNewGroups,
    select: selectRecommendGroups,
    staleTime: STALE_TIME,
    refetchOnMount: "always",
  });

// 승인되어 옮겨온 방을 바로 보이도록 탭 진입마다 재조회
export const useMyGroups = () =>
  useQuery({
    queryKey: discussionKeys.groups("joined"),
    queryFn: getMyGroups,
    select: toDiscussionGroupViews,
    staleTime: STALE_TIME,
    refetchOnMount: "always",
  });

// 승인 결과 알림 연동 전까지 탭 진입마다 재조회
export const usePendingGroups = () =>
  useQuery({
    queryKey: discussionKeys.groups("pending"),
    queryFn: getPendingGroups,
    select: toDiscussionGroupViews,
    staleTime: STALE_TIME,
    refetchOnMount: "always",
  });

export const useSearchGroups = (keyword: string) =>
  useQuery({
    queryKey: discussionKeys.search(keyword),
    queryFn: () => searchGroups(keyword),
    select: toDiscussionGroupViews,
    enabled: keyword.length > 0,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
