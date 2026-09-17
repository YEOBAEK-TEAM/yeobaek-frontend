import BookCover from "@/components/common/bookCover/BookCover";

import type { DiscussionTopicView } from "@/types/training/discussion/room";

type SelectedTopicCardProps = {
  topic: DiscussionTopicView;
};

export default function SelectedTopicCard({ topic }: SelectedTopicCardProps) {
  return (
    <div className="flex h-18 items-center gap-3.5 rounded-xl border border-[#5B5552] bg-[#EEEBE6] px-4.5">
      <BookCover src={topic.coverUrl} className="h-13 w-9 shrink-0 rounded-sm" />

      <div className="min-w-0">
        <p className="truncate text-[17px] leading-6 text-[#2C2A2B]">{topic.title}</p>
        <p className="truncate text-[13px] leading-5 text-[#4F4D4E]">{topic.subtitle}</p>
      </div>
    </div>
  );
}
