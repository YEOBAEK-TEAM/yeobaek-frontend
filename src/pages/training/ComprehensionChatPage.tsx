import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import ComprehensionMessageList from "@/components/training/comprehension/ComprehensionMessageList";
import ConnectionStatusBanner from "@/components/training/comprehension/ConnectionStatusBanner";
import ChatActionButtons from "@/components/training/shared/chat/ChatActionButtons";
import ChatInput from "@/components/training/shared/chat/ChatInput";
import PinnedBookSummary from "@/components/training/shared/chat/PinnedBookSummary";
import { COMPREHENSION_TITLE } from "@/constants/training/comprehensionChat";
import { useComprehensionChat } from "@/hooks/training/useComprehensionChat";
import { useBookmarks, useLibraryBooks } from "@/hooks/training/useComprehensionLibrary";
import { formatPageRange } from "@/utils/training/formatPageRange";

export default function ComprehensionChatPage() {
  const navigate = useNavigate();

  const {
    phase,
    status,
    messages,
    selection,
    isWaiting,
    sendMessage,
    handleQuickReply,
    retryMessage,
    answerConfirmEnd,
    continueAnotherTopic,
    retryConnection,
  } = useComprehensionChat();

  const { data: books = [] } = useLibraryBooks();
  const { data: bookmarks = [] } = useBookmarks();

  // 선택 정보 없이 들어오면 선택 화면으로 되돌림
  useEffect(() => {
    if (!selection) navigate("/training/comprehension", { replace: true });
  }, [selection, navigate]);

  const bookmark = selection?.bookmarkId
    ? bookmarks.find((item) => item.bookmarkId === selection.bookmarkId)
    : undefined;

  const pinned = bookmark ?? books.find((item) => item.bookId === selection?.bookId);

  return (
    <main className="flex h-dvh flex-col">
      <Header title={COMPREHENSION_TITLE} onBack={() => navigate(-1)} />

      {pinned && (
        <PinnedBookSummary
          coverUrl={pinned.coverUrl}
          title={pinned.title}
          subtitle={pinned.author}
          pageRange={bookmark ? formatPageRange(bookmark.startPage, bookmark.endPage) : undefined}
        />
      )}

      <ConnectionStatusBanner status={status} onRetry={retryConnection} />

      <ComprehensionMessageList
        messages={messages}
        onQuickReply={handleQuickReply}
        onRetry={retryMessage}
      />

      {phase.type === "confirmEnd" && (
        <ChatActionButtons
          actions={[
            {
              id: "decline",
              label: "아니요",
              variant: "primary",
              onClick: () => answerConfirmEnd(false),
            },
            { id: "accept", label: "예", variant: "dark", onClick: () => answerConfirmEnd(true) },
            {
              id: "another",
              label: "다른 주제로 이어가기",
              variant: "outline",
              onClick: continueAnotherTopic,
            },
          ]}
        />
      )}

      {phase.type !== "confirmEnd" && phase.type !== "ended" && (
        <ChatInput disabled={isWaiting || phase.type === "connecting"} onSend={sendMessage} />
      )}
    </main>
  );
}
