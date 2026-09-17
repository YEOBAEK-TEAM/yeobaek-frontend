import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
  ANALYZED_TEXT,
  ANALYZING_TEXT,
  COMPREHENSION_GUIDE_TEXT,
  EMPTY_REPORT_TEXT,
  ENDED_SYSTEM_TEXT,
  ENDING_TEXT,
  ENTRY_ERROR_TEXT,
  MESSAGES_ERROR_TEXT,
  REPORT_LOAD_ERROR_TEXT,
  RETRY_LABEL,
  START_ERROR_TEXT,
  SUMMATION_ERROR_TEXT,
} from "@/constants/training/bookReportChat";
import { REPORT_PATH } from "@/constants/library/report";
import {
  trainingReviewQuery,
  useCreateTrainingSummation,
  useSendTrainingMessage,
  useStartTraining,
  useTrainingEntry,
  useTrainingMessages,
  useTrainingReview,
  useTrainingReviews,
} from "@/hooks/training/useBookReportTrainingQueries";
import { myProfile } from "@/mocks/my";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/common/toast";
import { useBookReportChatStore } from "@/stores/training/bookReportChat";
import { getApiErrorMessage, getApiErrorStatus } from "@/utils/common/getApiErrorMessage";
import { wait, withMinimumDelay } from "@/utils/common/withMinimumDelay";
import { ritiReportCard, ritiThoughtSummary } from "@/utils/training/createBookReportMessage";
import {
  ritiLoading,
  ritiPlainText,
  ritiQuickReplies,
  ritiText,
  systemText,
  userText,
} from "@/utils/training/createChatMessage";
import { josa } from "@/utils/training/josa";
import { toReadingReport, toThoughtComparison } from "@/utils/training/toTrainingView";

import type { BookReportMessage } from "@/types/training/bookReportChat";
import type { ChatQuickReply } from "@/types/training/chat";
import type { ReadingReport } from "@/types/training/readingReport";

const ANALYZE_DURATION_MS = 1400;

const ENDED_REDIRECT_MS = 1500;

// 내 말풍선과 다음 응답 사이 간격
const USER_ECHO_DELAY_MS = 400;

// 분석완료 표시 유지 시간
const ANALYZED_HOLD_MS = 800;

// 다른 관점 보기 칩이 붙는 내 메시지 수
const ANOTHER_VIEW_TURN = 2;

// 새로고침해도 이어가도록 주소에 보관하는 값
const TRAINING_ROOM_PARAM = "trainingRoomId";
const REVIEW_PARAM = "reviewId";

// 서버 메시지 뒤에 붙는 화면 전용 메시지
const REPLY_LOADING: BookReportMessage = { id: "reply-loading", role: "riti", kind: "loading" };

const ANOTHER_VIEW_CHIP: BookReportMessage = {
  id: "another-view-chip",
  role: "riti",
  kind: "quickReplies",
  replies: [{ id: "another-view", label: "다른 관점 보기" }],
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

const getGreeting = (nickname: string, bookTitle: string) =>
  `${nickname}님, 가장 최근에 ${bookTitle}${josa(bookTitle, "을", "를")} 완독하시고\n독후감을 작성하셨네요!!\n\n어느 독후감으로 논리를 확장해볼까요?`;

export const useBookReportChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const showToast = useToastStore((state) => state.showToast);

  const nickname = useAuthStore((state) => state.nickname) ?? myProfile.nickname;

  const trainingRoomId = toId(searchParams.get(TRAINING_ROOM_PARAM));
  const reviewId = toId(searchParams.get(REVIEW_PARAM));

  const phase = useBookReportChatStore((state) => state.phase);
  const localMessages = useBookReportChatStore((state) => state.messages);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const entryQuery = useTrainingEntry(trainingRoomId === null);
  const reviewsQuery = useTrainingReviews(isSheetOpen);
  const messagesQuery = useTrainingMessages(trainingRoomId);
  const reviewQuery = useTrainingReview(reviewId);

  const startTraining = useStartTraining();
  const sendMessageMutation = useSendTrainingMessage();
  const createSummation = useCreateTrainingSummation();

  // 렌더 전 연속 입력에도 한 번만 요청
  const isBusyRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const entry = entryQuery.data;

  // 화면 이탈 시 진행 중 요청 취소와 단계 초기화
  useEffect(
    () => () => {
      abortRef.current?.abort();
      useBookReportChatStore.getState().reset();
    },
    [],
  );

  // 주소에 훈련방이 있으면 대화 단계로 복구
  useEffect(() => {
    if (trainingRoomId === null) return;

    const store = useBookReportChatStore.getState();
    if (store.phase.type === "select" || store.phase.type === "empty") {
      store.setPhase({ type: "chatting" });
    }
  }, [trainingRoomId]);

  // 진입 응답 기준 첫 안내 메시지 구성
  useEffect(() => {
    if (trainingRoomId !== null || entryQuery.isPending) return;

    const store = useBookReportChatStore.getState();
    if (store.phase.type !== "select" && store.phase.type !== "empty") return;

    store.clearMessages();

    if (entry) {
      store.setPhase({ type: "select" });
      store.pushMessage(ritiText(getGreeting(entry.nickname, entry.bookTitle)));
      store.pushMessage(
        ritiQuickReplies([
          { id: "select-recent-report", label: entry.bookTitle },
          { id: "open-report-list", label: "독후감 목록보기" },
        ]),
      );
      return;
    }

    // 작성한 독후감이 없으면 404
    if (getApiErrorStatus(entryQuery.error) === 404) {
      store.setPhase({ type: "empty" });
      store.pushMessage(ritiText(EMPTY_REPORT_TEXT));
      store.pushMessage(
        ritiQuickReplies([{ id: "guide-other-training", label: "다른 훈련 안내" }]),
      );
      return;
    }

    store.pushMessage(ritiText(ENTRY_ERROR_TEXT));
    store.pushMessage(ritiQuickReplies([{ id: "retry-entry", label: RETRY_LABEL }]));
  }, [trainingRoomId, entryQuery.isPending, entry, entryQuery.error]);

  // 없거나 권한 없는 훈련방이면 훈련 페이지로 이동
  useEffect(() => {
    if (getApiErrorStatus(messagesQuery.error) !== 404) return;

    showToast(getApiErrorMessage(messagesQuery.error, MESSAGES_ERROR_TEXT), "error");
    navigate("/training", { replace: true });
  }, [messagesQuery.error, navigate, showToast]);

  const isReplying = sendMessageMutation.isPending;

  const messages = useMemo<BookReportMessage[]>(() => {
    if (trainingRoomId === null) return localMessages;

    if (messagesQuery.isError) return MESSAGES_ERROR;

    const history = messagesQuery.data ?? [];
    const list: BookReportMessage[] = [...history, ...localMessages];

    if (isReplying) list.push(REPLY_LOADING);

    const userMessageCount = history.filter((message) => message.role === "user").length;
    const hasFailedMessage = localMessages.some(
      (message) => message.kind === "text" && message.status === "failed",
    );

    if (
      phase.type === "chatting" &&
      !isReplying &&
      !hasFailedMessage &&
      userMessageCount >= ANOTHER_VIEW_TURN
    ) {
      list.push(ANOTHER_VIEW_CHIP);
    }

    return list;
  }, [
    trainingRoomId,
    localMessages,
    messagesQuery.isError,
    messagesQuery.data,
    isReplying,
    phase.type,
  ]);

  const selectReport = useCallback(
    async (report: ReadingReport) => {
      const store = useBookReportChatStore.getState();
      if (store.phase.type !== "select" || !entry || isBusyRef.current) return;

      isBusyRef.current = true;

      store.pushMessage(userText(report.bookTitle));
      store.setPhase({ type: "analyzing", report });

      await wait(USER_ECHO_DELAY_MS);

      const analyzing = useBookReportChatStore.getState();
      analyzing.pushMessage(ritiReportCard(report));

      const loading = ritiLoading();
      analyzing.pushMessage(loading);

      try {
        // 선택 화면에서 보여준 인사말을 첫 AI 메시지로 저장
        const { trainingRoomId: startedRoomId } = await withMinimumDelay(
          startTraining.mutateAsync({
            reviewId: report.reportId,
            message: getGreeting(entry.nickname, entry.bookTitle),
          }),
          ANALYZE_DURATION_MS,
        );

        const next = useBookReportChatStore.getState();
        next.removeMessage(loading.id);
        next.pushMessage(ritiPlainText(ANALYZING_TEXT));
        next.pushMessage(ritiPlainText(ANALYZED_TEXT));

        await wait(ANALYZED_HOLD_MS);

        // 새 채팅창으로 전환
        const chatting = useBookReportChatStore.getState();
        chatting.clearMessages();
        chatting.setPhase({ type: "chatting" });

        setSearchParams(
          {
            [TRAINING_ROOM_PARAM]: String(startedRoomId),
            [REVIEW_PARAM]: String(report.reportId),
          },
          { replace: true },
        );
      } catch (error) {
        const failed = useBookReportChatStore.getState();
        failed.removeMessage(loading.id);
        failed.setPhase({ type: "select" });

        showToast(getApiErrorMessage(error, START_ERROR_TEXT), "error");
      } finally {
        isBusyRef.current = false;
      }
    },
    [entry, setSearchParams, showToast, startTraining],
  );

  // 진입 응답에 제목·작성일이 없어 독후감 상세 조회 후 선택
  const selectRecentReport = useCallback(async () => {
    if (!entry || isBusyRef.current) return;

    try {
      const review = await queryClient.fetchQuery(trainingReviewQuery(entry.reviewId));
      await selectReport(toReadingReport(review));
    } catch (error) {
      showToast(getApiErrorMessage(error, REPORT_LOAD_ERROR_TEXT), "error");
    }
  }, [entry, queryClient, selectReport, showToast]);

  const deliverMessage = useCallback(
    async (messageId: string, text: string) => {
      if (trainingRoomId === null) return;

      isBusyRef.current = true;

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await sendMessageMutation.mutateAsync({
          trainingRoomId,
          content: text,
          signal: controller.signal,
        });

        // 서버 이력 캐시에 반영됐으므로 임시 메시지 제거
        useBookReportChatStore.getState().removeMessage(messageId);
      } catch {
        if (controller.signal.aborted) return;

        useBookReportChatStore.getState().markFailed(messageId, true);
      } finally {
        isBusyRef.current = false;
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [sendMessageMutation, trainingRoomId],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const store = useBookReportChatStore.getState();
      if (store.phase.type !== "chatting" || !messagesQuery.data || isBusyRef.current) return;

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

  const showSummary = useCallback(async () => {
    const store = useBookReportChatStore.getState();
    if (store.phase.type !== "chatting" || trainingRoomId === null || isBusyRef.current) return;

    isBusyRef.current = true;
    store.setPhase({ type: "summarizing" });

    const loading = ritiLoading();
    store.pushMessage(loading);

    try {
      const summation = await createSummation.mutateAsync(trainingRoomId);
      const thought = toThoughtComparison(summation);

      const next = useBookReportChatStore.getState();
      next.removeMessage(loading.id);
      next.pushMessage(ritiThoughtSummary(thought));
      next.setPhase({ type: "summary", thought });
    } catch (error) {
      const failed = useBookReportChatStore.getState();
      failed.removeMessage(loading.id);
      failed.setPhase({ type: "chatting" });

      showToast(getApiErrorMessage(error, SUMMATION_ERROR_TEXT), "error");
    } finally {
      isBusyRef.current = false;
    }
  }, [createSummation, showToast, trainingRoomId]);

  // 메시지는 보낼 때마다 서버에 저장되어 종료 연출 후 완료 화면 이동
  const saveAndStop = useCallback(async () => {
    const store = useBookReportChatStore.getState();
    if (store.phase.type !== "summary" || trainingRoomId === null) return;

    store.pushMessage(ritiText(ENDING_TEXT));
    store.pushMessage(systemText(ENDED_SYSTEM_TEXT));
    store.setPhase({ type: "ended" });

    await wait(ENDED_REDIRECT_MS);
    navigate(`/training/complete?${TRAINING_ROOM_PARAM}=${trainingRoomId}`);
  }, [navigate, trainingRoomId]);

  // 독후감 수정 화면에서 직접 반영
  const applyToReport = useCallback(() => {
    if (reviewId === null) return;

    navigate(REPORT_PATH.edit(reviewId));
  }, [navigate, reviewId]);

  // 뒤로가기 이탈 처리
  const leaveChat = useCallback(
    () => (location.key === "default" ? navigate("/training") : navigate(-1)),
    [location.key, navigate],
  );

  const handleQuickReply = useCallback(
    async (reply: ChatQuickReply) => {
      if (isBusyRef.current) return;

      switch (reply.id) {
        case "select-recent-report":
          await selectRecentReport();
          return;

        // 이해력 증진 화면 이동
        case "go-comprehension":
          navigate("/training/comprehension");
          return;

        case "retry-entry":
          void entryQuery.refetch();
          return;

        case "retry-messages":
          void messagesQuery.refetch();
          return;
      }

      const store = useBookReportChatStore.getState();

      // 내 말풍선 표시 중 같은 버튼 연속 선택 방지
      isBusyRef.current = true;
      store.pushMessage(userText(reply.label));

      await wait(USER_ECHO_DELAY_MS);
      isBusyRef.current = false;

      switch (reply.id) {
        case "open-report-list":
          setIsSheetOpen(true);
          return;

        case "another-view":
          await showSummary();
          return;

        case "guide-other-training": {
          const next = useBookReportChatStore.getState();
          next.pushMessage(ritiText(`${nickname}님, ${COMPREHENSION_GUIDE_TEXT}`));
          next.pushMessage(
            ritiQuickReplies([
              { id: "go-comprehension", label: "이해력 증진 훈련 받으러가기", link: true },
            ]),
          );
          return;
        }
      }
    },
    [entryQuery, messagesQuery, navigate, nickname, selectRecentReport, showSummary],
  );

  // 대화 이후 단계에서만 상단 고정 독후감 표시
  const pinnedReport =
    phase.type === "select" || phase.type === "empty" || phase.type === "analyzing"
      ? null
      : (reviewQuery.data ?? null);

  return {
    phase,
    messages,
    pinnedReport,
    reviews: reviewsQuery,
    isReplying,
    isChatReady: phase.type === "chatting" && Boolean(messagesQuery.data),
    olderMessages: {
      hasNextPage: messagesQuery.hasNextPage,
      isFetchingNextPage: messagesQuery.isFetchingNextPage,
      fetchNextPage: messagesQuery.fetchNextPage,
    },
    isSheetOpen,
    closeSheet: () => setIsSheetOpen(false),
    selectReport: (report: ReadingReport) => {
      setIsSheetOpen(false);
      void selectReport(report);
    },
    sendMessage,
    retryMessage,
    leaveChat,
    handleQuickReply,
    applyToReport,
    saveAndStop,
  };
};
