import DiscussionGroupList from "@/components/training/discussion/DiscussionGroupList";
import { getSearchEmptyText } from "@/constants/training/discussion/discussion";
import { useSearchGroups } from "@/hooks/training/discussion/useDiscussionQueries";

type SearchResultContentProps = {
  keyword: string;
};

export default function SearchResultContent({ keyword }: SearchResultContentProps) {
  const { data, isPending, isError, refetch } = useSearchGroups(keyword);

  return (
    <div aria-live="polite" className="pt-8">
      <DiscussionGroupList
        layout="stack"
        groups={data}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyText={getSearchEmptyText(keyword)}
      />
    </div>
  );
}
