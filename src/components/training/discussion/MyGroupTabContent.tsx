import DiscussionGroupList from "@/components/training/discussion/DiscussionGroupList";
import { MY_GROUP_EMPTY_TEXT } from "@/constants/training/discussion/discussion";
import { useMyGroups } from "@/hooks/training/discussion/useDiscussionQueries";

export default function MyGroupTabContent() {
  const { data = [], isPending, isError, refetch } = useMyGroups();

  return (
    <div className="pt-6">
      <DiscussionGroupList
        layout="stack"
        groups={data}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyText={MY_GROUP_EMPTY_TEXT}
      />
    </div>
  );
}
