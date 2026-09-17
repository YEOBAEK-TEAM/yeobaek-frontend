import { LoaderCircle } from "lucide-react";

import { ROOM_LIST } from "@/constants/training/discussion/room";
import { SECTION_RETRY_LABEL } from "@/constants/home/home";

import type { Ref } from "react";

type InfiniteListSentinelProps = {
  ref: Ref<HTMLDivElement>;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
};

export default function InfiniteListSentinel({
  ref,
  isFetching,
  isError,
  onRetry,
}: InfiniteListSentinelProps) {
  return (
    <div ref={ref} className="flex min-h-14 items-center justify-center">
      {isFetching && (
        <LoaderCircle
          aria-label="더 불러오는 중"
          className="h-6 w-6 animate-spin text-[#A89F94] motion-reduce:animate-none"
        />
      )}

      {isError && !isFetching && (
        <p className="flex items-center gap-3 text-[13px] text-[#8F8F8F]">
          {ROOM_LIST.loadMoreErrorText}
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border border-[#C4BFB6] bg-white px-3 py-1 text-[13px] font-bold text-[#60564C]"
          >
            {SECTION_RETRY_LABEL}
          </button>
        </p>
      )}
    </div>
  );
}
