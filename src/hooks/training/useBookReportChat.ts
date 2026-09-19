import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
  ENDED_SYSTEM_TEXT,
  ENDING_TEXT,
  MESSAGES_ERROR_TEXT,
  MORE_PERSPECTIVE_LABEL,
  OTHER_PERSPECTIVE_EMPTY_TEXT,
  OTHER_PERSPECTIVE_LABEL,
  RETRY_LABEL,
  SKIP_PERSPECTIVE_LABEL,
  SUMMATION_ERROR_TEXT,
} from "@/constants/training/bookReportChat";
import { REPORT_PATH } from "@/constants/library/report";
import { HISTORY_ENTRY_PARAM, HISTORY_ENTRY_VALUE } from "@/constants/training/trainingHistory";
import { TRAINING_PATH } from "@/constants/training/trainingPrograms";
import {
  useCreateTrainingSummation,
  useSendTrainingMessage,
  useShowOtherPerspective,
  useSkipOtherPerspective,
  useTrainingMessages,
  useTrainingReview,
} from "@/hooks/training/useBookReportTrainingQueries";
import { useToastStore } from "@/stores/common/toast";
import { useBookReportChatStore } from "@/stores/training/bookReportChat";
import { getApiErrorMessage, getApiErrorStatus } from "@/utils/common/getApiErrorMessage";
import { wait } from "@/utils/common/withMinimumDelay";
import { ritiThoughtSummary } from "@/utils/training/createBookReportMessage";
import { ritiLoading, ritiText, systemText, userText } from "@/utils/training/createChatMessage";
import { toThoughtComparison } from "@/utils/training/toTrainingView";

import type { BookReportMessage } from "@/types/training/bookReportChat";
import type { ChatQuickReply } from "@/types/training/chat";

const ENDED_REDIRECT_MS = 1500;

// 새로고침해도 이어가도록 주소에 보관하는 값
const TRAINING_ROOM_PARAM = "trainingRoomId";

// 서버 메시지 뒤에 붙는 화면 전용 메시지
const REPLY_LOADING: BookReportMessage = { id: "reply-loading", role: "riti", kind: "loading" };

const PERSPECTIVE_CHIP: BookReportMessage = {
  id: "perspective-chip",
  role: "riti",
  kind: "quickReplies",
  direction: "row",
  replies: [
    { id: "show-perspective", label: OTHER_PERSPECTIVE_LABEL },
    { id: "skip-perspective", label: SKIP_PERSPECTIVE_LABEL },
  ],
};

const MORE_PERSPECTIVE_CHIP: BookReportMessage = {
  id: "more-perspective-chip",
  role: "riti",
  kind: "quickReplies",
  replies: [{ id: "show-perspective", label: MORE_PERSPECTIVE_LABEL }],
};

const MESSAGES_ERROR: BookReportMessage[] = [
  { id: "messages-error", role: "riti", kind: "text", text: MESSAGES_ERROR_TEXT },
  {
    id: "messages-retry",
    role: "riti",
    kind: "quickReplies",
    replies: [{ id: "retry-messages", label: RETRY_LABEL }],
  },
];

const toId = (value: string | null) => {
  const id = Number(value);
  return value && Number.isSafeInteger(id) && id > 0 ? id : null;
};

export const useBookReportChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const showToast = useToastStore((state) => state.showToast);

  const trainingRoomId = toId(searchParams.get(TRAINING_ROOM_PARAM));

  // 훈련 기록에서 들어오면 대화를 보기만 함
  const isReadOnly = searchParams.get(HISTORY_ENTRY_PARAM) === HISTORY_ENTRY_VALUE;

  const phase = useBookReportChatStore((state) => state.phase);
  const localMessages = useBookReportChatStore((state) => state.messages);

  const messagesQuery = useTrainingMessages(trainingRoomId);
  const reviewId = messagesQuery.data?.reviewId ?? null;
  const reviewQuery = useTrainingReview(reviewId);

  const sendMessageMutation = useSendTrainingMessage();
  const showPerspective = useShowOtherPerspective();
  const skipPerspective = useSkipOtherPerspective();
  const createSummation = useCreateTrainingSummation();

  // 렌더 전 연속 입력에도 한 번만 요청
  const isBusyRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  // 화면 이탈 시 진행 중 요청 취소와 단계 초기화
  useEffect(
    () => () => {
      abortRef.current?.abort();
      useBookReportChatStore.getState().reset();
    },
    [],
  );

  // 훈련방 없이 들어오면 독후감 선택부터
  useEffect(() => {
    if (trainingRoomId === null) navigate(TRAINING_PATH.bookReportSelect, { replace: true });
  }, [trainingRoomId, navigate]);

  const roomStatus = messagesQuery.data?.status ?? null;
  const historyMessages = messagesQuery.data?.messages;

  // 서버 방 상태 기준으로 재진입 시 단계 복구
  useEffect(() => {
    if (roomStatus === null || isReadOnly) return;

    const store = useBookReportChatStore.getState();
    if (store.phase.type !== "select" && store.phase.type !== "chatting") return;

    if (roomStatus === "GROWTH_PROMPT") {
      store.setPhase({ type: "perspectivePrompt" });
      return;
    }

    // 관점을 본 뒤 상태, 대화를 이어가면 단계가 바뀌므로 들어올 때만 복구
    if (roomStatus === "GROWTH_CHECK") {
      if (store.phase.type === "select") store.setPhase({ type: "perspectiveShown" });
      return;
    }

    if (roomStatus === "COMPLETED") {
      // 요약 카드는 이력에 남아 있어 그 값으로 복구
      const summary = historyMessages?.findLast((message) => message.kind === "thoughtSummary");

      store.setPhase(
        summary?.kind === "thoughtSummary"
          ? { type: "summary", thought: summary.thought }
          : { type: "chatting" },
      );
      return;
    }

    store.setPhase({ type: "chatting" });
  }, [roomStatus, historyMessages, isReadOnly]);

  // 없거나 권한 없는 훈련방이면 훈련 페이지로 이동
  useEffect(() => {
    if (getApiErrorStatus(messagesQuery.error) !== 404) return;

    showToast(getApiErrorMessage(messagesQuery.error, MESSAGES_ERROR_TEXT), "error");
    navigate(TRAINING_PATH.main, { replace: true });
  }, [messagesQuery.error, navigate, showToast]);

  const isReplying =
    sendMessageMutation.isPending || showPerspective.isPending || skipPerspective.isPending;

  const messages = useMemo<BookReportMessage[]>(() => {
    if (messagesQuery.isError) return MESSAGES_ERROR;

    const history = messagesQuery.data?.messages ?? [];
    const list: BookReportMessage[] = [...history, ...localMessages];

    if (isReplying) list.push(REPLY_LOADING);

    // 선택 전까지는 전송이 막혀 버튼만 노출
    if (phase.type === "perspectivePrompt" && !isReplying) list.push(PERSPECTIVE_CHIP);

    // 관점을 본 뒤에는 더 보기 버튼과 함께 대화를 이어감
    if (phase.type === "perspectiveShown" && !isReplying) list.push(MORE_PERSPECTIVE_CHIP);

    return list;
  }, [messagesQuery.isError, messagesQuery.data, localMessages, isReplying, phase.type]);

  // 요약이 만들어지면 말풍선으로 보여주고 단계 전환
  const applySummary = useCallback((thought: { before: string; after: string }) => {
    const store = useBookReportChatStore.getState();
    store.pushMessage(ritiThoughtSummary(thought));
    store.setPhase({ type: "summary", thought });
  }, []);

  const deliverMessage = useCallback(
    async (messageId: string, text: string) => {
      if (trainingRoomId === null) return;

      isBusyRef.current = true;

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const reply = await sendMessageMutation.mutateAsync({
          trainingRoomId,
          content: text,
          signal: controller.signal,
        });

        // 서버 이력 캐시에 반영됐으므로 임시 메시지 제거
        useBookReportChatStore.getState().removeMessage(messageId);

        if (reply.end && reply.summation) {
          applySummary(toThoughtComparison(reply.summation));
          return;
        }

        if (reply.perspectiveAvailable) {
          useBookReportChatStore.getState().setPhase({ type: "perspectivePrompt" });
        }
      } catch {
        if (controller.signal.aborted) return;

        useBookReportChatStore.getState().markFailed(messageId, true);
      } finally {
        isBusyRef.current = false;
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [applySummary, sendMessageMutation, trainingRoomId],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const store = useBookReportChatStore.getState();
      const canSend = store.phase.type === "chatting" || store.phase.type === "perspectiveShown";
      if (!canSend || !messagesQuery.data || isBusyRef.current) return;

      store.setPhase({ type: "chatting" });

      const message = { ...userText(text), status: "sending" as const };
      store.pushMessage(message);

      await deliverMessage(message.id, text);
    },
    [deliverMessage, messagesQuery.data],
  );

  const retryMessage = useCallback(
    async (messageId: string, text: string) => {
      const store = useBookReportChatStore.getState();
      if (store.phase.type !== "chatting" || isBusyRef.current) return;

      store.markFailed(messageId, false);

      await deliverMessage(messageId, text);
    },
    [deliverMessage],
  );

  // 선택과 관점 카드가 모두 서버 이력에 남아 다시 조회
  const selectPerspective = useCallback(async () => {
    if (trainingRoomId === null || isBusyRef.current) return;

    isBusyRef.current = true;

    try {
      await showPerspective.mutateAsync(trainingRoomId);
      await messagesQuery.refetch();

      useBookReportChatStore.getState().setPhase({ type: "perspectiveShown" });
    } catch (error) {
      const store = useBookReportChatStore.getState();

      // 소개할 관점이 없으면 대화만 이어감
      if (getApiErrorStatus(error) === 404) {
        store.pushMessage(ritiText(OTHER_PERSPECTIVE_EMPTY_TEXT));
        store.setPhase({ type: "chatting" });
        return;
      }

      showToast(getApiErrorMessage(error, SUMMATION_ERROR_TEXT), "error");
    } finally {
      isBusyRef.current = false;
    }
  }, [messagesQuery, showPerspective, showToast, trainingRoomId]);

  // 미리보기만 받고 저장은 요약 화면으로 넘어갈 때 처리
  const skipPerspectiveStep = useCallback(async () => {
    if (trainingRoomId === null || isBusyRef.current) return;

    isBusyRef.current = true;

    const loading = ritiLoading();
    useBookReportChatStore.getState().pushMessage(loading);

    try {
      // 미리보기를 받은 뒤 바로 저장해 방이 대기 상태로 남지 않게 함
      await skipPerspective.mutateAsync(trainingRoomId);
      const summation = await createSummation.mutateAsync(trainingRoomId);

      const store = useBookReportChatStore.getState();
      store.removeMessage(loading.id);

      applySummary(toThoughtComparison(summation));
    } catch (error) {
      const store = useBookReportChatStore.getState();
      store.removeMessage(loading.id);
      store.setPhase({ type: "perspectivePrompt" });

      showToast(getApiErrorMessage(error, SUMMATION_ERROR_TEXT), "error");
    } finally {
      isBusyRef.current = false;
    }
  }, [applySummary, createSummation, showToast, skipPerspective, trainingRoomId]);

  // 요약 화면으로 넘어가는 시점에 요약을 저장
  const saveAndStop = useCallback(async () => {
    const store = useBookReportChatStore.getState();
    if (store.phase.type !== "summary" || trainingRoomId === null || isBusyRef.current) return;

    isBusyRef.current = true;

    try {
      await createSummation.mutateAsync(trainingRoomId);
    } catch (error) {
      showToast(getApiErrorMessage(error, SUMMATION_ERROR_TEXT), "error");
      isBusyRef.current = false;
      return;
    }

    const ending = useBookReportChatStore.getState();
    ending.pushMessage(ritiText(ENDING_TEXT));
    ending.pushMessage(systemText(ENDED_SYSTEM_TEXT));
    ending.setPhase({ type: "ended" });

    isBusyRef.current = false;

    await wait(ENDED_REDIRECT_MS);
    navigate(`${TRAINING_PATH.bookReportComplete}?${TRAINING_ROOM_PARAM}=${trainingRoomId}`);
  }, [createSummation, navigate, showToast, trainingRoomId]);

  // 독후감 수정 화면에서 직접 반영
  const applyToReport = useCallback(() => {
    if (reviewId === null) return;

    navigate(REPORT_PATH.edit(reviewId));
  }, [navigate, reviewId]);

  // 뒤로가기 이탈 처리
  const leaveChat = useCallback(() => {
    if (isReadOnly) {
      navigate(TRAINING_PATH.history, { replace: true });
      return;
    }

    return location.key === "default" ? navigate(TRAINING_PATH.main) : navigate(-1);
  }, [isReadOnly, location.key, navigate]);

  const handleQuickReply = useCallback(
    async (reply: ChatQuickReply) => {
      if (isBusyRef.current) return;

      switch (reply.id) {
        case "retry-messages":
          void messagesQuery.refetch();
          return;

        case "show-perspective":
          await selectPerspective();
          return;

        case "skip-perspective":
          await skipPerspectiveStep();
          return;
      }
    },
    [messagesQuery, selectPerspective, skipPerspectiveStep],
  );

  const pinnedReport = reviewQuery.data ?? null;

  return {
    phase,
    isReadOnly,
    messages,
    pinnedReport,
    reviewTitle: messagesQuery.data?.reviewTitle ?? "",
    isReplying,
    isChatReady:
      (phase.type === "chatting" || phase.type === "perspectiveShown") &&
      Boolean(messagesQuery.data),
    olderMessages: {
      hasNextPage: messagesQuery.hasNextPage,
      isFetchingNextPage: messagesQuery.isFetchingNextPage,
      fetchNextPage: messagesQuery.fetchNextPage,
    },
    sendMessage,
    retryMessage,
    leaveChat,
    handleQuickReply,
    applyToReport,
    saveAndStop,
  };
};
