import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/common/confirmModal/ConfirmModal";
import Header from "@/components/common/header/Header";
import ChatActionButtons from "@/components/training/chat/ChatActionButtons";
import ChatInput from "@/components/training/chat/ChatInput";
import MessageList from "@/components/training/chat/MessageList";
import PinnedBookSummary from "@/components/training/chat/PinnedBookSummary";
import ReportListBottomSheet from "@/components/training/chat/ReportListBottomSheet";
import {
  BOOK_REPORT_CHAT_TITLE,
  EXIT_BEFORE_START_TEXT,
  EXIT_IN_PROGRESS_TEXT,
} from "@/constants/training/bookReportChat";
import { useBookReportChat } from "@/hooks/training/useBookReportChat";
import { myProfile } from "@/mocks/my";
import { useAuthStore } from "@/stores/auth";

export default function BookReportChatPage() {
  const navigate = useNavigate();

  const nickname = useAuthStore((state) => state.nickname) ?? myProfile.nickname;

  const {
    phase,
    messages,
    reports,
    isStreaming,
    isSheetOpen,
    closeSheet,
    selectReport,
    sendMessage,
    retryMessage,
    leaveChat,
    handleQuickReply,
    applyToReport,
    continueAnotherTopic,
    saveAndStop,
  } = useBookReportChat();

  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  // 뒤로가기 확인 문구 분기
  const isTrainingStarted =
    phase.type === "analyzing" || phase.type === "chatting" || phase.type === "summary";

  const handleBack = () => {
    if (phase.type === "ended") {
      navigate(-1);
      return;
    }

    setIsExitConfirmOpen(true);
  };

  // 상단 고정 배너 노출 단계
  const pinnedReport =
    phase.type === "chatting" || phase.type === "summary" || phase.type === "ended"
      ? phase.report
      : null;

  return (
    <main className="flex h-dvh flex-col">
      <Header title={BOOK_REPORT_CHAT_TITLE} onBack={handleBack} />

      {pinnedReport && <PinnedBookSummary report={pinnedReport} />}

      <MessageList
        messages={messages}
        nickname={nickname}
        onQuickReply={handleQuickReply}
        onRetry={retryMessage}
      />

      {phase.type === "summary" && (
        <ChatActionButtons
          onApply={applyToReport}
          onContinue={continueAnotherTopic}
          onSaveAndStop={saveAndStop}
        />
      )}

      {phase.type !== "summary" && phase.type !== "ended" && (
        <ChatInput disabled={isStreaming || phase.type === "analyzing"} onSend={sendMessage} />
      )}

      {isSheetOpen && (
        <ReportListBottomSheet reports={reports} onSelect={selectReport} onClose={closeSheet} />
      )}

      {isExitConfirmOpen && (
        <ConfirmModal
          onConfirm={() => {
            setIsExitConfirmOpen(false);
            void leaveChat(isTrainingStarted);
          }}
          onClose={() => setIsExitConfirmOpen(false)}
        >
          {isTrainingStarted ? EXIT_IN_PROGRESS_TEXT : EXIT_BEFORE_START_TEXT}
        </ConfirmModal>
      )}
    </main>
  );
}
