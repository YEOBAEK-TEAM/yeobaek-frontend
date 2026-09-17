import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getDiscussionTopics, getRoomDetail, getRooms } from "@/api/training/discussion/room";
import { discussionKeys } from "@/hooks/training/discussion/useDiscussionQueries";
import {
  toRoomDetailView,
  toRoomSummaryView,
  toTopicViews,
} from "@/utils/training/discussion/toRoomView";

import type { InfiniteData } from "@tanstack/react-query";
import type { RoomFilter, RoomPageResponse } from "@/types/training/discussion/room";

const STALE_TIME = 30_000;

// 토론방 query key 팩토리
export const roomKeys = {
  all: [...discussionKeys.all, "rooms"] as const,
  topics: (keyword: string) => [...roomKeys.all, "topics", keyword] as const,
  list: (filter: RoomFilter, keyword: string) =>
    [...roomKeys.all, "list", { filter, keyword }] as const,
  detail: (roomId: number) => [...roomKeys.all, "detail", roomId] as const,
};

const selectRoomSummaries = (data: InfiniteData<RoomPageResponse>) =>
  data.pages.flatMap((page) => page.rooms.map(toRoomSummaryView));

export const useDiscussionTopics = (keyword: string) =>
  useQuery({
    queryKey: roomKeys.topics(keyword),
    queryFn: () => getDiscussionTopics(keyword),
    select: toTopicViews,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });

export const useRoomList = (filter: RoomFilter, keyword: string) =>
  useInfiniteQuery({
    queryKey: roomKeys.list(filter, keyword),
    queryFn: ({ pageParam }) => getRooms({ filter, keyword, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    select: selectRoomSummaries,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });

export const useRoomDetail = (roomId: number) =>
  useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: () => getRoomDetail(roomId),
    select: toRoomDetailView,
  });
