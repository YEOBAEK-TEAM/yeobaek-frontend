import DiscussionGroupList from "@/components/training/discussion/DiscussionGroupList";
import GroupSection from "@/components/training/discussion/GroupSection";
import {
  HOT_BADGE_LABEL,
  HOT_GROUP_SECTION,
  NEW_GROUP_SECTION,
} from "@/constants/training/discussion/discussion";
import { useHotGroups, useNewGroups } from "@/hooks/training/discussion/useDiscussionQueries";

export default function RecommendTabContent() {
  const hotQuery = useHotGroups();
  const newQuery = useNewGroups();

  return (
    <div className="flex flex-col gap-3 pt-9">
      <GroupSection title={HOT_GROUP_SECTION.title} description={HOT_GROUP_SECTION.description}>
        <DiscussionGroupList
          layout="carousel"
          variant="recommend"
          groups={hotQuery.data}
          isPending={hotQuery.isPending}
          isError={hotQuery.isError}
          onRetry={() => void hotQuery.refetch()}
          emptyText={HOT_GROUP_SECTION.emptyText}
          badge={HOT_BADGE_LABEL}
        />
      </GroupSection>

      <GroupSection title={NEW_GROUP_SECTION.title} description={NEW_GROUP_SECTION.description}>
        <DiscussionGroupList
          layout="carousel"
          variant="recommend"
          groups={newQuery.data}
          isPending={newQuery.isPending}
          isError={newQuery.isError}
          onRetry={() => void newQuery.refetch()}
          emptyText={NEW_GROUP_SECTION.emptyText}
        />
      </GroupSection>
    </div>
  );
}
