import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  COMPREHENSION_END_ANSWER,
  ENDED_SYSTEM_TEXT,
  MESSAGES_ERROR_TEXT,
  SUMMATION_ERROR_TEXT,
} from "@/constants/training/comprehensionChat";
import { TRAINING_PATH } from "@/constants/training/trainingPrograms";
import {
  useCreateUnderstandSummation,
  useSendUnderstandMessage,
  useUnderstandMessages,
} from "@/hooks/training/useComprehensionQueries";
import { useToastStore } from "@/stores/common/toast";
import { useComprehensionChatStore } from "@/stores/training/comprehensionChat";
import { getApiErrorMessage, getApiErrorStatus } from "@/utils/common/getApiErrorMessage";
import { ritiQuickReplies, systemText, userText } from "@/utils/training/createChatMessage";

import type { ChatQuickReply } from "@/types/training/chat";
import type { ComprehensionMessage } from "@/types/training/comprehension";

// 새로고침해도 이어가도록 주소에 보관하는 값
const UNDERSTAND_ROOM_PARAM = "understandRoomId";

const REPLY_LOADING: ComprehensionMessage = {
  id: "reply-loading",
  role: "riti",
  kind: "loading",
};

const toId = (value: string | null) => {
  const id = Number(value);
  return value && Number.isSafeInteger(id) && id > 0 ? id : null;
};

export const useComprehensionChat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const showToast = useToastStore((state) => state.showToast);

  const understandRoomId = toId(searchParams.get(UNDERSTAND_ROOM_PARAM));

  const phase = useComprehensionChatStore((state) => state.phase);
  const localMessages = useComprehensionChatStore((state) => state.messages);
  const book = useComprehensionChatStore((state) => state.book);
  const options = useComprehensionChatStore((state) => state.options);

  const messagesQuery = useUnderstandMessages(understandRoomId);
  const sendMessageMutation = useSendUnderstandMessage();
  const createSummation = useCreateUnderstandSummation();

  const isBusyRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  // 화면 이탈 시 진행 중 요청 취소
  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  // 방 없이 들어오면 책갈피 선택부터
  useEffect(() => {
    if (understandRoomId === null) navigate(TRAINING_PATH.comprehension, { replace: true });
  }, [understandRoomId, navigate]);

  useEffect(() => {
    const store = useComprehensionChatStore.getState();
    if (store.phase.type === "selecting") store.setPhase({ type: "chatting" });
  }, [understandRoomId]);

  // 없거나 권한 없는 방이면 훈련 페이지로 이동
  useEffect(() => {
    if (getApiErrorStatus(messagesQuery.error) !== 404) return;

    showToast(getApiErrorMessage(messagesQuery.error, MESSAGES_ERROR_TEXT), "error");
    navigate(TRAINING_PATH.main, { replace: true });
  }, [messagesQuery.error, navigate, showToast]);

  const isWaiting = sendMessageMutation.isPending || createSummation.isPending;

  const messages = useMemo<ComprehensionMessage[]>(() => {
    const history = messagesQuery.data ?? [];
    const list: ComprehensionMessage[] = [...history, ...localMessages];

    if (isWaiting) list.push(REPLY_LOADING);

    // 예시 질문은 첫 대화에서만 노출
    if (phase.type === "chatting" && !isWaiting && history.length === 1 && options.length > 0) {
      list.push(
        ritiQuickReplies(
          options.map((option, index) => ({ id: `option-${index}`, label: option })),
          "column",
        ),
      );
    }

    return list;
  }, [messagesQuery.data, localMessages, isWaiting, phase.type, options]);

  const deliverMessage = useCallback(
    async (messageId: string, text: string) => {
      if (understandRoomId === null) return;

      isBusyRef.current = true;

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const reply = await sendMessageMutation.mutateAsync({
          understandRoomId,
          content: text,
          signal: controller.signal,
        });

        const store = useComprehensionChatStore.getState();
        store.removeMessage(messageId);
        store.setOptions([]);

        if (reply.end) {
          store.pushMessage(systemText(ENDED_SYSTEM_TEXT));
          store.setPhase({ type: "ended" });
          return;
        }

        store.setPhase(
          reply.awaitingEndConfirmation ? { type: "confirmEnd" } : { type: "chatting" },
        );
      } catch {
        if (controller.signal.aborted) return;

        useComprehensionChatStore.getState().markFailed(messageId, true);
      } finally {
        isBusyRef.current = false;
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [sendMessageMutation, understandRoomId],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const store = useComprehensionChatStore.getState();
      if (store.phase.type !== "chatting" || !messagesQuery.data || isBusyRef.current) return;

      const message = { ...userText(text), status: "sending" as const };
      store.pushMessage(message);

      await deliverMessage(message.id, text);
    },
    [deliverMessage, messagesQuery.data],
  );

  const retryMessage = useCallback(
    async (messageId: string, text: string) => {
      const store = useComprehensionChatStore.getState();
      if (isBusyRef.current) return;

      store.markFailed(messageId, false);

      await deliverMessage(messageId, text);
    },
    [deliverMessage],
  );

  // 고른 값을 그대로 보내야 서버가 종료 여부를 판단
  const answerConfirmEnd = useCallback(
    async (accepted: boolean) => {
      const store = useComprehensionChatStore.getState();
      if (store.phase.type !== "confirmEnd" || isBusyRef.current) return;

      const answer = accepted ? COMPREHENSION_END_ANSWER.accept : COMPREHENSION_END_ANSWER.decline;

      const message = { ...userText(answer), status: "sending" as const };
      store.pushMessage(message);
      store.setPhase({ type: "chatting" });

      await deliverMessage(message.id, answer);
    },
    [deliverMessage],
  );

  const handleQuickReply = useCallback(
    async (reply: ChatQuickReply) => {
      if (isBusyRef.current) return;

      await sendMessage(reply.label);
    },
    [sendMessage],
  );

  // 요약은 조회 후 없을 때만 생성
  const goSummary = useCallback(async () => {
    if (understandRoomId === null || isBusyRef.current) return;

    isBusyRef.current = true;

    try {
      await createSummation.mutateAsync(understandRoomId);

      navigate(
        `${TRAINING_PATH.comprehensionComplete}?${UNDERSTAND_ROOM_PARAM}=${understandRoomId}`,
      );
    } catch (error) {
      showToast(getApiErrorMessage(error, SUMMATION_ERROR_TEXT), "error");
    } finally {
      isBusyRef.current = false;
    }
  }, [createSummation, navigate, showToast, understandRoomId]);

  return {
    phase,
    messages,
    book,
    isWaiting,
    isChatReady: Boolean(messagesQuery.data),
    sendMessage,
    retryMessage,
    handleQuickReply,
    answerConfirmEnd,
    goSummary,
  };
};
