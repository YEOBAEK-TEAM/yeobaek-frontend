import { useNavigate } from "react-router-dom";

import SectionState from "@/components/common/section/SectionState";
import ActiveDiscussionCard from "@/components/training/discussion/ActiveDiscussionCard";
import ActiveDiscussionEmpty from "@/components/training/discussion/ActiveDiscussionEmpty";
import CreateGroupButton from "@/components/training/discussion/CreateGroupButton";
import DiscussionSubTabs from "@/components/training/discussion/DiscussionSubTabs";
import GroupSearchBar from "@/components/training/discussion/GroupSearchBar";
import SearchResultContent from "@/components/training/discussion/SearchResultContent";
import { DISCUSSION_PATH } from "@/constants/training/discussion/discussion";
import { useActiveDiscussion } from "@/hooks/training/discussion/useDiscussionQueries";
import { useGroupSearch } from "@/hooks/training/discussion/useGroupSearch";

export default function DiscussionPanel() {
  const navigate = useNavigate();

  const activeQuery = useActiveDiscussion();
  const activeDiscussion = activeQuery.data;

  const { input, setInput, keyword, submit } = useGroupSearch();

  return (
    <div role="tabpanel" aria-label="토론장 참여" className="flex flex-1 flex-col">
      <div className="mx-auto mt-4 w-88">
        {activeQuery.isPending || activeQuery.isError ? (
          <SectionState
            isError={activeQuery.isError}
            onRetry={() => void activeQuery.refetch()}
            className="h-36.5"
          />
        ) : activeDiscussion ? (
          <ActiveDiscussionCard
            discussion={activeDiscussion}
            onContinue={() => navigate(DISCUSSION_PATH.room(activeDiscussion.roomId))}
          />
        ) : (
          <ActiveDiscussionEmpty />
        )}
      </div>

      {/* 검색부터 하단까지 배경 분리 영역 */}
      <section aria-label="토론 그룹" className="mt-3.5 flex-1 bg-[#F9F8F4] pt-8.5 pb-10">
        <div className="flex items-center gap-3 px-6">
          <GroupSearchBar value={input} onChange={setInput} onSubmit={submit} />
          <CreateGroupButton onClick={() => navigate(DISCUSSION_PATH.createGroup)} />
        </div>

        {keyword ? <SearchResultContent keyword={keyword} /> : <DiscussionSubTabs />}
      </section>
    </div>
  );
}
