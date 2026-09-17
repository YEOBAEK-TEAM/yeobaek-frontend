import { useState } from "react";

import ConfirmModal from "@/components/common/confirmModal/ConfirmModal";
import Header from "@/components/common/header/Header";
import ChatActionButtons from "@/components/training/shared/chat/ChatActionButtons";
import ChatInput from "@/components/training/shared/chat/ChatInput";
import BookReportMessageList from "@/components/training/bookReport/BookReportMessageList";
import PinnedBookSummary from "@/components/training/shared/chat/PinnedBookSummary";
import ReportListBottomSheet from "@/components/training/bookReport/ReportListBottomSheet";
import {
  BOOK_REPORT_CHAT_TITLE,
  EXIT_BEFORE_START_TEXT,
  EXIT_IN_PROGRESS_TEXT,
} from "@/constants/training/bookReportChat";
import { useBookReportChat } from "@/hooks/training/useBookReportChat";
import { myProfile } from "@/mocks/my";
import { useAuthStore } from "@/stores/auth";

export default function BookReportChatPage() {
  const nickname = useAuthStore((state) => state.nickname) ?? myProfile.nickname;

  const {
    phase,
    messages,
    pinnedReport,
    reviews,
    isReplying,
    isChatReady,
    olderMessages,
    isSheetOpen,
    closeSheet,
    selectReport,
    sendMessage,
    retryMessage,
    leaveChat,
    handleQuickReply,
    applyToReport,
    saveAndStop,
  } = useBookReportChat();

  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  // 뒤로가기 확인 문구 분기
  const isTrainingStarted = phase.type !== "select" && phase.type !== "empty";

  const handleBack = () => {
    if (phase.type === "ended") {
      leaveChat();
      return;
    }

    setIsExitConfirmOpen(true);
  };

  return (
    <main className="flex h-dvh flex-col">
      <Header title={BOOK_REPORT_CHAT_TITLE} onBack={handleBack} />

      {pinnedReport && (
        <PinnedBookSummary
          coverUrl={pinnedReport.coverUrl}
          title={pinnedReport.bookTitle}
          subtitle={pinnedReport.reportTitle}
        />
      )}

      <BookReportMessageList
        messages={messages}
        nickname={nickname}
        olderMessages={olderMessages}
        onQuickReply={handleQuickReply}
        onRetry={retryMessage}
      />

      {phase.type === "summary" && (
        <ChatActionButtons
          actions={[
            {
              id: "apply",
              label: "독후감에 반영하기",
              variant: "primary",
              onClick: applyToReport,
            },
            {
              // 이어가기 API 준비 전까지 선택 불가
              id: "continue",
              label: "다른 주제로 이어가기",
              variant: "dark",
              onClick: () => undefined,
              disabled: true,
            },
            {
              id: "save",
              label: "대화 내용 저장하고 중단하기",
              variant: "outline",
              onClick: () => void saveAndStop(),
            },
          ]}
        />
      )}

      {phase.type !== "summary" && phase.type !== "ended" && (
        <ChatInput disabled={!isChatReady || isReplying} onSend={sendMessage} />
      )}

      {isSheetOpen && (
        <ReportListBottomSheet
          reports={reviews.data ?? []}
          isPending={reviews.isPending}
          isError={reviews.isError}
          hasNextPage={reviews.hasNextPage}
          isFetchingNextPage={reviews.isFetchingNextPage}
          fetchNextPage={reviews.fetchNextPage}
          onRetry={() => void reviews.refetch()}
          onSelect={selectReport}
          onClose={closeSheet}
        />
      )}

      {isExitConfirmOpen && (
        <ConfirmModal
          onConfirm={() => {
            setIsExitConfirmOpen(false);
            leaveChat();
          }}
          onClose={() => setIsExitConfirmOpen(false)}
        >
          {isTrainingStarted ? EXIT_IN_PROGRESS_TEXT : EXIT_BEFORE_START_TEXT}
        </ConfirmModal>
      )}
    </main>
  );
}
