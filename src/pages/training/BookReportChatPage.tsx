import { useState } from "react";

import ConfirmModal from "@/components/common/confirmModal/ConfirmModal";
import Header from "@/components/common/header/Header";
import ChatActionButtons from "@/components/training/shared/chat/ChatActionButtons";
import ChatInput from "@/components/training/shared/chat/ChatInput";
import BookReportMessageList from "@/components/training/bookReport/BookReportMessageList";
import PinnedBookSummary from "@/components/training/shared/chat/PinnedBookSummary";
import {
  BOOK_REPORT_CHAT_TITLE,
  EXIT_BEFORE_START_TEXT,
  EXIT_IN_PROGRESS_TEXT,
  SUMMARY_ACTION_LABEL,
} from "@/constants/training/bookReportChat";
import { useBookReportChat } from "@/hooks/training/useBookReportChat";
import { myProfile } from "@/mocks/my";
import { useAuthStore } from "@/stores/auth";

export default function BookReportChatPage() {
  const nickname = useAuthStore((state) => state.nickname) ?? myProfile.nickname;

  const {
    phase,
    isReadOnly,
    messages,
    pinnedReport,
    reviewTitle,
    isReplying,
    isChatReady,
    olderMessages,
    sendMessage,
    retryMessage,
    leaveChat,
    handleQuickReply,
    applyToReport,
    saveAndStop,
  } = useBookReportChat();

  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  // 뒤로가기 확인 문구 분기
  const isTrainingStarted = phase.type !== "select";

  const handleBack = () => {
    // 기록 열람은 확인 없이 바로 나감
    if (isReadOnly || phase.type === "ended") {
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
          subtitle={reviewTitle || pinnedReport.reportTitle}
        />
      )}

      <BookReportMessageList
        messages={messages}
        nickname={nickname}
        olderMessages={olderMessages}
        onQuickReply={handleQuickReply}
        onRetry={retryMessage}
      />

      {!isReadOnly && phase.type === "summary" && (
        <ChatActionButtons
          actions={[
            {
              id: "apply",
              label: SUMMARY_ACTION_LABEL.applyToReport,
              variant: "primary",
              onClick: applyToReport,
            },
            {
              id: "finish",
              label: SUMMARY_ACTION_LABEL.finish,
              variant: "outline",
              onClick: () => void saveAndStop(),
            },
          ]}
        />
      )}

      {!isReadOnly && phase.type !== "summary" && phase.type !== "ended" && (
        <ChatInput disabled={!isChatReady || isReplying} onSend={sendMessage} />
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
