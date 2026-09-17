import { Clock3 } from "lucide-react";

import BookCover from "@/components/common/bookCover/BookCover";
import BookMeta from "@/components/training/discussion/BookMeta";
import HostParticipants from "@/components/training/discussion/HostParticipants";
import {
  CONTINUE_DISCUSSION_LABEL,
  LAST_VISITED_LABEL,
} from "@/constants/training/discussion/discussion";

import type { ActiveDiscussionView } from "@/types/training/discussion/discussion";

type ActiveDiscussionCardProps = {
  discussion: ActiveDiscussionView;
  onContinue: () => void;
};

export default function ActiveDiscussionCard({
  discussion,
  onContinue,
}: ActiveDiscussionCardProps) {
  return (
    <article className="relative flex h-36.5 items-center gap-3.5 rounded-xl bg-[#F7F6F1] pr-4 pl-3">
      <BookCover src={discussion.coverUrl} className="h-32.5 w-20 shrink-0 rounded-md" />

      <div className="flex h-full min-w-0 flex-1 flex-col pt-5.5 pb-3.5">
        <BookMeta title={discussion.title} author={discussion.author} className="pr-13" />

        <HostParticipants host={discussion.host} className="mt-1" />

        <button
          type="button"
          onClick={onContinue}
          className="mt-auto h-8 w-full rounded-md bg-[#E0DDD8] text-[12px] font-medium text-[#54555A] active:bg-[#D6D2CB]"
        >
          {CONTINUE_DISCUSSION_LABEL}
        </button>
      </div>

      <p className="absolute top-3 right-4 flex items-center gap-1 text-[13px] font-medium text-[#54555A] tabular-nums">
        <Clock3 aria-hidden="true" className="h-4 w-4" />
        <span className="sr-only">{LAST_VISITED_LABEL}</span>
        <time dateTime={discussion.lastVisitedAt}>{discussion.lastVisitedLabel}</time>
      </p>
    </article>
  );
}
