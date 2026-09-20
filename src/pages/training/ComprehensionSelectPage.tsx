import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/common/confirmModal/ConfirmModal";
import NoticeModal from "@/components/training/discussion/shared/NoticeModal";
import Header from "@/components/common/header/Header";
import SectionState from "@/components/common/section/SectionState";
import BookSelectSection from "@/components/training/comprehension/BookSelectSection";
import SelectableBookItem from "@/components/training/comprehension/SelectableBookItem";
import StartButton from "@/components/training/comprehension/StartButton";
import AnalyzingOverlay from "@/components/training/bookReport/AnalyzingOverlay";
import {
  BOOKMARK_EMPTY_TEXT,
  getAnalyzingPagesText,
  BOOKMARK_SECTION_TITLE,
  COMPREHENSION_TITLE,
  ONGOING_TRAINING_BLOCKED_TEXT,
  ONGOING_TRAINING_CONFIRM_TEXT,
  START_ERROR_TEXT,
} from "@/constants/training/comprehensionChat";
import { TRAINING_PATH } from "@/constants/training/trainingPrograms";
import { useInfiniteSentinel } from "@/hooks/training/discussion/useInfiniteSentinel";
import { useComprehensionRoom } from "@/hooks/training/useOngoingTraining";
import { useOngoingTrainingGuard } from "@/hooks/training/useOngoingTrainingGuard";
import { useBookmarks, useCreateUnderstandRoom } from "@/hooks/training/useComprehensionQueries";
import { myProfile } from "@/mocks/my";
import { useAuthStore } from "@/stores/auth";
import { useComprehensionChatStore } from "@/stores/training/comprehensionChat";

const RADIO_NAME = "comprehension-selection";

export default function ComprehensionSelectPage() {
  const navigate = useNavigate();

  const nickname = useAuthStore((state) => state.nickname) ?? myProfile.nickname;

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const {
    data: bookmarks = [],
    isPending,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useBookmarks();

  const createRoom = useCreateUnderstandRoom();

  // 훈련은 한 번에 하나만 진행, 같은 책갈피 범위면 이어가기 다른 범위면 차단
  const guard = useOngoingTrainingGuard({
    roomQuery: useComprehensionRoom(),
    chatPath: TRAINING_PATH.comprehensionChat,
    roomIdKey: "understandRoomId",
  });

  const sentinelRef = useInfiniteSentinel({
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
  });

  const isDivided = (index: number) =>
    index < bookmarks.length - 1 &&
    selectedKey !== bookmarks[index].key &&
    selectedKey !== bookmarks[index + 1].key;

  // 묶음의 모든 페이지 ID를 그대로 훈련 범위로 전달
  const start = () => {
    const selected = bookmarks.find((bookmark) => bookmark.key === selectedKey);
    if (!selected || createRoom.isPending) return;

    if (guard.blockBeforeStart(selected.key)) return;

    createRoom.mutate(selected.targetIds, {
      onError: (error) => {
        // 안내로 처리했으면 실패 문구는 감춤
        void guard.resolveConflict(error, selected.key).then((resolved) => {
          if (resolved) createRoom.reset();
        });
      },
      onSuccess: (room) => {
        const store = useComprehensionChatStore.getState();
        store.reset();
        store.setOptions(room.options);
        store.setPhase({ type: "chatting" });

        navigate(`${TRAINING_PATH.comprehensionChat}?understandRoomId=${room.understandRoomId}`, {
          replace: true,
        });
      },
    });
  };

  const renderBookmarks = () => {
    if (isError && bookmarks.length === 0) {
      return <SectionState isError onRetry={() => void refetch()} className="h-40" />;
    }

    return (
      <>
        {bookmarks.map((bookmark, index) => (
          <SelectableBookItem
            key={bookmark.key}
            name={RADIO_NAME}
            value={bookmark.key}
            checked={selectedKey === bookmark.key}
            divided={isDivided(index)}
            coverUrl={bookmark.coverUrl}
            title={
              <span className="flex items-baseline gap-2">
                {bookmark.title}
                <span className="text-[16px] text-[#4F4D4E]">{bookmark.pageLabel}</span>
              </span>
            }
            author={bookmark.author}
            onSelect={() => setSelectedKey(bookmark.key)}
          />
        ))}

        {hasNextPage && (
          <div ref={sentinelRef} className="mt-2 h-18 animate-pulse rounded-xl bg-[#EFEDE7]" />
        )}
      </>
    );
  };

  return (
    <main className="flex min-h-dvh flex-col">
      <Header title={COMPREHENSION_TITLE} onBack={() => navigate(-1)} />

      <div className="flex-1 pb-6">
        <BookSelectSection
          title={BOOKMARK_SECTION_TITLE}
          isEmpty={!isPending && bookmarks.length === 0}
          emptyText={BOOKMARK_EMPTY_TEXT}
        >
          {renderBookmarks()}
        </BookSelectSection>
      </div>

      {createRoom.isError && (
        <p className="px-5 text-center text-[13px] text-[#D9534F]">{START_ERROR_TEXT}</p>
      )}

      <StartButton disabled={!selectedKey || createRoom.isPending} onClick={start} />

      {createRoom.isPending && <AnalyzingOverlay text={getAnalyzingPagesText(nickname)} />}

      {guard.action === "continue" && (
        <ConfirmModal onConfirm={guard.openConflictRoom} onClose={guard.closeAction}>
          {ONGOING_TRAINING_CONFIRM_TEXT}
        </ConfirmModal>
      )}

      {guard.action === "blocked" && (
        <NoticeModal message={ONGOING_TRAINING_BLOCKED_TEXT} onClose={guard.closeAction} />
      )}
    </main>
  );
}
