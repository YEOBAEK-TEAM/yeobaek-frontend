import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getDiscussionTopics,
  getRoomApplicants,
  getRoomDetail,
  getRoomInviteCode,
  getRooms,
} from "@/api/training/discussion/room";
import { discussionKeys } from "@/hooks/training/discussion/useDiscussionQueries";
import {
  toApplicantViews,
  toRoomDetailView,
  toRoomSummaryView,
  toTopicViews,
} from "@/utils/training/discussion/toRoomView";

import type { InfiniteData } from "@tanstack/react-query";
import type {
  DiscussionRoomResponse,
  PageResponse,
  RoomFilter,
} from "@/types/training/discussion/room";

const STALE_TIME = 30_000;

// 토론방 query key 팩토리
export const roomKeys = {
  all: [...discussionKeys.all, "rooms"] as const,
  topics: (keyword: string) => [...roomKeys.all, "topics", keyword] as const,
  list: (filter: RoomFilter, keyword: string) =>
    [...roomKeys.all, "list", { filter, keyword }] as const,
  detail: (roomId: number) => [...roomKeys.all, "detail", roomId] as const,
  inviteCode: (roomId: number) => [...roomKeys.all, "invite-code", roomId] as const,
  applicants: (roomId: number) => [...roomKeys.all, "applicants", roomId] as const,
};

const selectRoomSummaries = (data: InfiniteData<PageResponse<DiscussionRoomResponse>>) =>
  data.pages.flatMap((page) => page.items.map(toRoomSummaryView));

export const useDiscussionTopics = (keyword: string) =>
  useQuery({
    queryKey: roomKeys.topics(keyword),
    queryFn: ({ signal }) => getDiscussionTopics(keyword, signal),
    select: toTopicViews,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });

export const useRoomList = (filter: RoomFilter, keyword: string) =>
  useInfiniteQuery({
    queryKey: roomKeys.list(filter, keyword),
    queryFn: ({ pageParam, signal }) => getRooms({ filter, keyword, page: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    select: selectRoomSummaries,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });

export const useRoomDetail = (roomId: number) =>
  useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: ({ signal }) => getRoomDetail(roomId, signal),
    select: toRoomDetailView,
  });

// 방장만 조회 가능해 방장 여부가 확인된 뒤에만 호출
export const useRoomInviteCode = (roomId: number, enabled: boolean) =>
  useQuery({
    queryKey: roomKeys.inviteCode(roomId),
    queryFn: ({ signal }) => getRoomInviteCode(roomId, signal),
    enabled,
    staleTime: STALE_TIME,
  });

export const useRoomApplicants = (roomId: number, enabled: boolean) =>
  useQuery({
    queryKey: roomKeys.applicants(roomId),
    queryFn: ({ signal }) => getRoomApplicants(roomId, signal),
    select: toApplicantViews,
    enabled,
    staleTime: STALE_TIME,
  });
