import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { chatConnectionManager } from "@/api/training/comprehension/chatConnectionManager";
import { ENDED_SYSTEM_TEXT, ENDING_TEXT } from "@/constants/training/bookReportChat";
import {
  ANOTHER_TOPIC_TEXT,
  COMPREHENSION_GREETING,
  COMPREHENSION_QUICK_REPLIES,
} from "@/constants/training/comprehensionChat";
import { myProfile } from "@/mocks/my";
import { useAuthStore } from "@/stores/auth";
import { useComprehensionChatStore } from "@/stores/training/comprehensionChat";
import {
  createMessageId,
  ritiLoading,
  ritiQuickReplies,
  ritiText,
  systemText,
} from "@/utils/training/createChatMessage";

import type { ChatQuickReply } from "@/types/training/chat";
import type { ChatSocketSignal } from "@/types/training/chatSocket";

const ENDED_REDIRECT_MS = 1500;

export const useComprehensionChat = () => {
  const navigate = useNavigate();

  const nickname = useAuthStore((state) => state.nickname) ?? myProfile.nickname;

  const phase = useComprehensionChatStore((state) => state.phase);
  const status = useComprehensionChatStore((state) => state.status);
  const messages = useComprehensionChatStore((state) => state.messages);
  const selection = useComprehensionChatStore((state) => state.selection);

  // 세션 연결과 이벤트 구독
  useEffect(() => {
    if (!selection) return;

    const store = useComprehensionChatStore.getState();
    store.resetConversation();
    store.setPhase({ type: "connecting" });

    const handleSignal = (signal: ChatSocketSignal) => {
      const current = useComprehensionChatStore.getState();

      if (signal.type === "status") {
        current.setStatus(signal.status);

        if (signal.status !== "open") return;

        // 재연결 후 대기열 전송
        current.queue.forEach((queued) =>
          chatConnectionManager.send(
            queued.replyId
              ? {
                  type: "quickReply:select",
                  clientMessageId: queued.clientMessageId,
                  replyId: queued.replyId,
                  label: queued.text,
                }
              : {
                  type: "message:send",
                  clientMessageId: queued.clientMessageId,
                  text: queued.text,
                },
          ),
        );
        current.clearQueue();

        return;
      }

      const event = signal.event;

      if (event.type === "session:ready") {
        current.setPhase({ type: "chatting" });

        if (current.messages.length > 0) return;

        current.pushMessage(ritiText(`${nickname}님 ${COMPREHENSION_GREETING}`));
        current.pushMessage(ritiQuickReplies(COMPREHENSION_QUICK_REPLIES, "column"));
        return;
      }

      if (event.type === "message:ack") {
        current.replaceMessageId(event.clientMessageId, event.messageId, event.sentAt);
        return;
      }

      if (event.type === "ai:thinking") {
        current.pushMessage(ritiLoading());
        return;
      }

      if (event.type === "ai:message") {
        current.removeByKind("loading");
        current.pushMessage({
          id: event.messageId,
          role: "riti",
          kind: "text",
          text: event.text,
          sentAt: event.sentAt,
        });
        return;
      }

      if (event.type === "session:confirmEnd") {
        current.setPhase({ type: "confirmEnd" });
        return;
      }

      if (event.type === "session:ended") {
        current.pushMessage(ritiText(ENDING_TEXT));
        current.pushMessage(systemText(ENDED_SYSTEM_TEXT));
        current.setPhase({ type: "ended" });

        window.setTimeout(() => navigate("/training/comprehension/complete"), ENDED_REDIRECT_MS);
      }
    };

    const unsubscribe = chatConnectionManager.subscribe(handleSignal);
    chatConnectionManager.connect(selection);

    return () => {
      unsubscribe();
      chatConnectionManager.disconnect();
    };
  }, [selection, nickname, navigate]);

  const sendText = useCallback((text: string, replyId?: string) => {
    const store = useComprehensionChatStore.getState();
    const clientMessageId = createMessageId();

    store.pushMessage({
      id: clientMessageId,
      role: "user",
      kind: "text",
      text,
      status: "sending",
    });

    if (chatConnectionManager.getStatus() !== "open") {
      store.enqueue({ clientMessageId, text, replyId });
      return;
    }

    chatConnectionManager.send(
      replyId
        ? { type: "quickReply:select", clientMessageId, replyId, label: text }
        : { type: "message:send", clientMessageId, text },
    );
  }, []);

  const sendMessage = useCallback((text: string) => sendText(text), [sendText]);

  const handleQuickReply = useCallback(
    (reply: ChatQuickReply) => {
      useComprehensionChatStore.getState().removeByKind("quickReplies");
      sendText(reply.label, reply.id);
    },
    [sendText],
  );

  const retryMessage = useCallback(
    (messageId: string, text: string) => {
      useComprehensionChatStore.getState().removeMessage(messageId);
      sendText(text);
    },
    [sendText],
  );

  const answerConfirmEnd = useCallback((accepted: boolean) => {
    const store = useComprehensionChatStore.getState();

    chatConnectionManager.send({ type: "session:confirmEnd:answer", accepted });

    if (!accepted) store.setPhase({ type: "chatting" });
  }, []);

  const continueAnotherTopic = useCallback(() => {
    const store = useComprehensionChatStore.getState();

    chatConnectionManager.send({ type: "session:confirmEnd:answer", accepted: false });
    store.setPhase({ type: "chatting" });
    store.pushMessage(ritiText(ANOTHER_TOPIC_TEXT));
    store.pushMessage(ritiQuickReplies(COMPREHENSION_QUICK_REPLIES, "column"));
  }, []);

  return {
    phase,
    status,
    messages,
    selection,
    isWaiting: messages.some((message) => message.kind === "loading"),
    sendMessage,
    handleQuickReply,
    retryMessage,
    answerConfirmEnd,
    continueAnotherTopic,
    retryConnection: () => chatConnectionManager.retry(),
  };
};
