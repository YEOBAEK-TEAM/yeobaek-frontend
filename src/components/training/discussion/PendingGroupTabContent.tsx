import DiscussionGroupList from "@/components/training/discussion/DiscussionGroupList";
import { PENDING_GROUP_EMPTY_TEXT } from "@/constants/training/discussion/discussion";
import { usePendingGroups } from "@/hooks/training/discussion/useDiscussionQueries";

export default function PendingGroupTabContent() {
  const { data, isPending, isError, refetch } = usePendingGroups();

  return (
    <div className="pt-6">
      <DiscussionGroupList
        layout="stack"
        groups={data}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyText={PENDING_GROUP_EMPTY_TEXT}
      />
    </div>
  );
}
