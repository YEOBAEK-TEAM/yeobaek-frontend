import DiscussionGroupList from "@/components/training/discussion/DiscussionGroupList";
import GroupSection from "@/components/training/discussion/GroupSection";
import {
  CREATED_GROUP_SECTION_TITLE,
  JOINED_GROUP_SECTION_TITLE,
  MY_GROUP_EMPTY_TEXT,
} from "@/constants/training/discussion/discussion";
import { useMyGroups } from "@/hooks/training/discussion/useDiscussionQueries";

export default function MyGroupTabContent() {
  const { data = [], isPending, isError, refetch } = useMyGroups();

  const createdGroups = data.filter((group) => group.isHost);
  const joinedGroups = data.filter((group) => !group.isHost);

  // 처음 만든 방 하나뿐이면 목록 그대로, 그 외엔 생성한 방을 따로 가로 스크롤
  const hasSections =
    createdGroups.length > 0 && (joinedGroups.length > 0 || createdGroups.length > 1);

  if (hasSections) {
    return (
      <div className="flex flex-col gap-3 pt-9">
        <GroupSection title={CREATED_GROUP_SECTION_TITLE}>
          <DiscussionGroupList
            layout="carousel"
            groups={createdGroups}
            isPending={false}
            isError={false}
            onRetry={() => void refetch()}
            emptyText={MY_GROUP_EMPTY_TEXT}
          />
        </GroupSection>

        {joinedGroups.length > 0 && (
          <GroupSection title={JOINED_GROUP_SECTION_TITLE}>
            <DiscussionGroupList
              layout="carousel"
              groups={joinedGroups}
              isPending={false}
              isError={false}
              onRetry={() => void refetch()}
              emptyText={MY_GROUP_EMPTY_TEXT}
            />
          </GroupSection>
        )}
      </div>
    );
  }

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
