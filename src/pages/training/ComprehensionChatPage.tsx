import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import ComprehensionMessageList from "@/components/training/comprehension/ComprehensionMessageList";
import ChatActionButtons from "@/components/training/shared/chat/ChatActionButtons";
import ChatInput from "@/components/training/shared/chat/ChatInput";
import PinnedBookSummary from "@/components/training/shared/chat/PinnedBookSummary";
import {
  COMPREHENSION_END_ANSWER,
  COMPREHENSION_TITLE,
} from "@/constants/training/comprehensionChat";
import { TRAINING_PATH } from "@/constants/training/trainingPrograms";
import { useComprehensionChat } from "@/hooks/training/useComprehensionChat";

// 종료 후 요약 화면으로 넘어가기 전 마무리 대사 노출
const ENDED_REDIRECT_MS = 1500;

export default function ComprehensionChatPage() {
  const navigate = useNavigate();

  const {
    phase,
    isReadOnly,
    messages,
    book,
    isWaiting,
    isChatReady,
    sendMessage,
    handleQuickReply,
    retryMessage,
    answerConfirmEnd,
    goSummary,
  } = useComprehensionChat();

  useEffect(() => {
    if (isReadOnly || phase.type !== "ended") return;

    const timer = window.setTimeout(() => void goSummary(), ENDED_REDIRECT_MS);

    return () => window.clearTimeout(timer);
  }, [isReadOnly, phase.type, goSummary]);

  return (
    <main className="flex h-dvh flex-col">
      <Header
        title={COMPREHENSION_TITLE}
        onBack={() =>
          navigate(isReadOnly ? TRAINING_PATH.history : TRAINING_PATH.main, { replace: true })
        }
      />

      {book && (
        <PinnedBookSummary
          coverUrl={book.coverUrl}
          title={book.title}
          subtitle={book.author}
          pageRange={book.pageLabel}
        />
      )}

      <ComprehensionMessageList
        messages={messages}
        onQuickReply={handleQuickReply}
        onRetry={retryMessage}
      />

      {!isReadOnly && phase.type === "confirmEnd" && (
        <ChatActionButtons
          actions={[
            {
              id: "decline",
              label: COMPREHENSION_END_ANSWER.decline,
              variant: "primary",
              onClick: () => void answerConfirmEnd(false),
            },
            {
              id: "accept",
              label: COMPREHENSION_END_ANSWER.accept,
              variant: "dark",
              onClick: () => void answerConfirmEnd(true),
            },
          ]}
        />
      )}

      {!isReadOnly && phase.type !== "confirmEnd" && phase.type !== "ended" && (
        <ChatInput disabled={!isChatReady || isWaiting} onSend={sendMessage} />
      )}
    </main>
  );
}
