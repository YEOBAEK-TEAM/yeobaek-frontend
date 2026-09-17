import BookCover from "@/components/common/bookCover/BookCover";
import BookMeta from "@/components/training/discussion/BookMeta";
import GroupBadge from "@/components/training/discussion/GroupBadge";
import HostParticipants from "@/components/training/discussion/HostParticipants";
import PendingStatus from "@/components/training/discussion/PendingStatus";
import { GROUP_ACTION_LABEL } from "@/constants/training/discussion/discussion";

import type { DiscussionGroupView } from "@/types/training/discussion/discussion";

type DiscussionGroupCardProps = {
  group: DiscussionGroupView;
  badge?: string;
  onAction: () => void;
};

export default function DiscussionGroupCard({ group, badge, onAction }: DiscussionGroupCardProps) {
  return (
    <article className="flex h-[159px] items-center gap-3 rounded-2xl bg-[#FBFAF7] px-4 shadow-[0_4px_14px_rgba(79,77,78,0.08)]">
      <BookCover src={group.coverUrl} className="h-33 w-20 shrink-0 rounded-md" />

      <div className="flex h-full min-w-0 flex-1 flex-col pt-7 pb-3.5">
        <BookMeta
          title={group.title}
          author={group.author}
          trailing={badge && <GroupBadge label={badge} />}
        />

        <HostParticipants host={group.host} className="mt-2" />

        <div className="mt-auto">
          {group.variant === "pending" ? (
            <PendingStatus />
          ) : (
            <button
              type="button"
              onClick={onAction}
              aria-label={`${group.title} ${GROUP_ACTION_LABEL[group.variant]}`}
              className="h-7.5 w-full rounded-xl bg-[#DAD6CE] text-[12px] font-medium text-[#4F4D4E] active:bg-[#CFCAC1]"
            >
              {GROUP_ACTION_LABEL[group.variant]}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
