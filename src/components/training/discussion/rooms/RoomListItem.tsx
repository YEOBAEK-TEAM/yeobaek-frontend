import { ChevronRight } from "lucide-react";

import BookCover from "@/components/common/bookCover/BookCover";
import TagList from "@/components/training/discussion/shared/TagList";

import type { RoomSummaryView } from "@/types/training/discussion/room";

type RoomListItemProps = {
  room: RoomSummaryView;
  onSelect: () => void;
};

const MAX_VISIBLE_TAGS = 3;

export default function RoomListItem({ room, onSelect }: RoomListItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-haspopup="dialog"
      className="flex w-full items-center gap-5 border-b border-[#E7E4DE] py-4 pr-6 pl-8 text-left active:bg-[#F4F2EC]"
    >
      <BookCover src={room.coverUrl} className="h-18 w-12 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[17px] leading-6 text-[#4F4D4E]">{room.title}</p>
        <p className="text-[15px] leading-6 text-[#4F4D4E]">{room.participantText}</p>

        <TagList tags={room.tags} maxVisible={MAX_VISIBLE_TAGS} className="mt-1.5" />
      </div>

      <ChevronRight aria-hidden="true" className="h-6 w-6 shrink-0 text-[#4F4D4E]" />
    </button>
  );
}
