import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "@/components/common/header/Header";
import SectionState from "@/components/common/section/SectionState";
import EmptyMessage from "@/components/training/discussion/EmptyMessage";
import FilterChipGroup from "@/components/training/discussion/rooms/FilterChipGroup";
import InfiniteListSentinel from "@/components/training/discussion/rooms/InfiniteListSentinel";
import RoomJoinFlow from "@/components/training/discussion/rooms/RoomJoinFlow";
import RoomListItem from "@/components/training/discussion/rooms/RoomListItem";
import SearchField from "@/components/training/discussion/shared/SearchField";
import {
  getRoomSearchEmptyText,
  ROOM_FILTERS,
  ROOM_LIST,
} from "@/constants/training/discussion/room";
import { useDebouncedSearchParam } from "@/hooks/training/discussion/useDebouncedSearchParam";
import { useInfiniteSentinel } from "@/hooks/training/discussion/useInfiniteSentinel";
import { useRoomList } from "@/hooks/training/discussion/useRoomQueries";

import type { RoomFilter, RoomSummaryView } from "@/types/training/discussion/room";

const SKELETON_ITEMS = [0, 1, 2, 3, 4];

const toFilter = (value: string | null): RoomFilter =>
  ROOM_FILTERS.find((filter) => filter.id === value)?.id ?? "all";

export default function RoomListPage() {
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();
  const filter = toFilter(params.get("filter"));

  const { input, setInput, keyword, submit } = useDebouncedSearchParam("q");

  const {
    data: rooms = [],
    isPending,
    isError,
    refetch,
    ...pagination
  } = useRoomList(filter, keyword);

  const sentinelRef = useInfiniteSentinel({
    hasNextPage: pagination.hasNextPage,
    isFetchingNextPage: pagination.isFetchingNextPage,
    isError: pagination.isFetchNextPageError,
    fetchNextPage: pagination.fetchNextPage,
  });

  const [selectedRoom, setSelectedRoom] = useState<RoomSummaryView | null>(null);

  const changeFilter = (next: RoomFilter) =>
    setParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);

        if (next === "all") nextParams.delete("filter");
        else nextParams.set("filter", next);

        return nextParams;
      },
      { replace: true },
    );

  const renderList = () => {
    if (isPending) {
      return SKELETON_ITEMS.map((item) => (
        <div key={item} className="flex items-center gap-5 border-b border-[#E7E4DE] py-4 pl-8">
          <span className="h-18 w-12 animate-pulse bg-[#EFEDE7]" />
          <span className="flex flex-1 flex-col gap-2">
            <span className="h-4 w-40 animate-pulse rounded bg-[#EFEDE7]" />
            <span className="h-4 w-20 animate-pulse rounded bg-[#EFEDE7]" />
            <span className="h-5 w-44 animate-pulse rounded-full bg-[#EFEDE7]" />
          </span>
        </div>
      ));
    }

    if (isError && rooms.length === 0) {
      return (
        <div className="px-5 pt-4">
          <SectionState isError onRetry={() => void refetch()} className="h-45" />
        </div>
      );
    }

    if (rooms.length === 0) {
      return (
        <EmptyMessage text={keyword ? getRoomSearchEmptyText(keyword) : ROOM_LIST.emptyText} />
      );
    }

    return (
      <>
        <ul>
          {rooms.map((room) => (
            <li key={room.roomId}>
              <RoomListItem room={room} onSelect={() => setSelectedRoom(room)} />
            </li>
          ))}
        </ul>

        <InfiniteListSentinel
          ref={sentinelRef}
          isFetching={pagination.isFetchingNextPage}
          isError={pagination.isFetchNextPageError}
          onRetry={() => void pagination.fetchNextPage()}
        />
      </>
    );
  };

  return (
    <main className="flex min-h-dvh flex-col pb-8">
      <Header title={ROOM_LIST.title} onBack={() => navigate(-1)} />

      <div className="px-5">
        <SearchField
          label={ROOM_LIST.searchLabel}
          placeholder={ROOM_LIST.searchPlaceholder}
          value={input}
          onChange={setInput}
          onSubmit={submit}
        />
      </div>

      <div className="mt-5 px-5.5">
        <FilterChipGroup
          label={ROOM_LIST.filterLabel}
          options={ROOM_FILTERS}
          value={filter}
          onChange={changeFilter}
        />
      </div>

      <div className="mt-3">{renderList()}</div>

      {selectedRoom && (
        <RoomJoinFlow
          roomId={selectedRoom.roomId}
          initialRoom={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </main>
  );
}
