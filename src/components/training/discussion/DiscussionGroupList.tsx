import { useNavigate } from "react-router-dom";

import SectionState from "@/components/common/section/SectionState";
import DiscussionGroupCard from "@/components/training/discussion/DiscussionGroupCard";
import EmptyMessage from "@/components/training/discussion/EmptyMessage";
import { DISCUSSION_PATH } from "@/constants/training/discussion/discussion";

import type {
  DiscussionGroupView,
  GroupCardVariant,
  GroupListLayout,
} from "@/types/training/discussion/discussion";

type DiscussionGroupListProps = {
  groups: DiscussionGroupView[] | undefined;
  layout: GroupListLayout;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  emptyText: string;
  badge?: string;
  // 추천 목록처럼 가입 상태와 무관하게 같은 액션을 보여줄 때 지정
  variant?: GroupCardVariant;
};

const SKELETON_ITEMS = [0, 1];

// 다음 카드가 살짝 보이도록 고정 폭 + 좌우 여백 스냅
const LAYOUT_CLASS = {
  carousel: {
    list: "flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    item: "w-78 shrink-0 snap-start",
    empty: "py-10",
  },
  stack: {
    list: "mx-auto flex w-88 flex-col gap-4",
    item: "",
    empty: "py-18",
  },
};

export default function DiscussionGroupList({
  groups = [],
  layout,
  isPending,
  isError,
  onRetry,
  emptyText,
  badge,
  variant,
}: DiscussionGroupListProps) {
  const navigate = useNavigate();

  const layoutClass = LAYOUT_CLASS[layout];

  if (isError) {
    return (
      <div className="px-6">
        <SectionState isError onRetry={onRetry} className="h-[159px]" />
      </div>
    );
  }

  if (!isPending && groups.length === 0) {
    return <EmptyMessage text={emptyText} className={layoutClass.empty} />;
  }

  const handleAction = (group: DiscussionGroupView) =>
    navigate(
      group.variant === "joined"
        ? DISCUSSION_PATH.room(group.roomId)
        : DISCUSSION_PATH.groupDetail(group.groupId),
    );

  return (
    <ul className={layoutClass.list} aria-busy={isPending}>
      {isPending
        ? SKELETON_ITEMS.map((item) => (
            <li key={item} className={layoutClass.item}>
              <div className="h-[159px] animate-pulse rounded-2xl bg-[#EFEDE7]" />
            </li>
          ))
        : groups.map((group) => {
            const cardGroup = variant ? { ...group, variant } : group;

            return (
              <li key={group.groupId} className={layoutClass.item}>
                <DiscussionGroupCard
                  group={cardGroup}
                  badge={badge}
                  onAction={() => handleAction(cardGroup)}
                />
              </li>
            );
          })}
    </ul>
  );
}
