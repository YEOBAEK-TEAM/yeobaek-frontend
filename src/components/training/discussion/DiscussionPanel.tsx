import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SectionState from "@/components/common/section/SectionState";
import ActiveDiscussionCard from "@/components/training/discussion/ActiveDiscussionCard";
import ActiveDiscussionEmpty from "@/components/training/discussion/ActiveDiscussionEmpty";
import CreateGroupButton from "@/components/training/discussion/CreateGroupButton";
import DiscussionSubTabs from "@/components/training/discussion/DiscussionSubTabs";
import EntryActionSheet from "@/components/training/discussion/entry/EntryActionSheet";
import GroupSearchBar from "@/components/training/discussion/GroupSearchBar";
import JoinCodeModal from "@/components/training/discussion/join-code/JoinCodeModal";
import SearchResultContent from "@/components/training/discussion/SearchResultContent";
import { DISCUSSION_PATH } from "@/constants/training/discussion/discussion";
import { useActiveDiscussion } from "@/hooks/training/discussion/useDiscussionQueries";
import { useGroupSearch } from "@/hooks/training/discussion/useGroupSearch";

export default function DiscussionPanel() {
  const navigate = useNavigate();

  const activeQuery = useActiveDiscussion();
  const activeDiscussion = activeQuery.data;

  const { input, setInput, keyword, submit } = useGroupSearch();

  const [params, setParams] = useSearchParams();

  // 초대 링크로 들어온 코드가 있으면 값이 채워진 입력 모달 오픈
  const inviteCode = params.get("code");

  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [isJoinCodeOpen, setIsJoinCodeOpen] = useState(false);

  const closeJoinCode = () => {
    setIsJoinCodeOpen(false);

    if (inviteCode === null) return;

    setParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.delete("code");
        return nextParams;
      },
      { replace: true },
    );
  };

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
          <CreateGroupButton onClick={() => setIsEntrySheetOpen(true)} />
        </div>

        {keyword ? <SearchResultContent keyword={keyword} /> : <DiscussionSubTabs />}
      </section>

      {isEntrySheetOpen && (
        <EntryActionSheet
          onClose={() => setIsEntrySheetOpen(false)}
          onJoinCode={() => setIsJoinCodeOpen(true)}
        />
      )}

      {(isJoinCodeOpen || inviteCode !== null) && (
        <JoinCodeModal initialCode={inviteCode ?? ""} onClose={closeJoinCode} />
      )}
    </div>
  );
}
