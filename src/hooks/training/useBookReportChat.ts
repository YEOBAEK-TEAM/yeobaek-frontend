import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  applyChatToReport,
  endBookReportSession,
  startBookReportSession,
} from "@/api/training/bookReportChat";
import {
  ANALYZED_TEXT,
  ANALYZING_TEXT,
  COMPREHENSION_GUIDE_TEXT,
  EMPTY_REPORT_TEXT,
  ENDED_SYSTEM_TEXT,
  ENDING_TEXT,
} from "@/constants/training/bookReportChat";
import { useChatStream } from "@/hooks/training/useChatStream";
import { useReadingReports } from "@/hooks/training/useReadingReports";
import { myProfile } from "@/mocks/my";
import { mockThoughtComparison } from "@/mocks/training/bookReportChatScript";
import { useAuthStore } from "@/stores/auth";
import { useBookReportChatStore } from "@/stores/training/bookReportChat";
import {
  ritiLoading,
  ritiPlainText,
  ritiQuickReplies,
  ritiReportCard,
  ritiText,
  ritiThoughtSummary,
  systemText,
  userText,
} from "@/utils/training/createChatMessage";
import { josa } from "@/utils/training/josa";

import type { QuickReply } from "@/types/training/bookReportChat";
import type { ReadingReport } from "@/types/training/readingReport";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ANALYZE_DURATION_MS = 1400;

const ENDED_REDIRECT_MS = 1500;

// 내 말풍선과 다음 응답 사이 간격
const USER_ECHO_DELAY_MS = 400;

// 분석완료 표시 유지 시간
const ANALYZED_HOLD_MS = 800;

// 다른 관점 보기 칩이 붙는 대화 차례
const ANOTHER_VIEW_TURN = 2;

export const useBookReportChat = () => {
  const navigate = useNavigate();

  const nickname = useAuthStore((state) => state.nickname) ?? myProfile.nickname;

  const { data: reports = [], isPending } = useReadingReports();

  const phase = useBookReportChatStore((state) => state.phase);
  const messages = useBookReportChatStore((state) => state.messages);

  const { start, isStreaming } = useChatStream();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const recentReport = reports.at(0) ?? null;

  // 단계별 초기 메시지 구성
  useEffect(() => {
    if (isPending) return;

    const store = useBookReportChatStore.getState();

    if (!recentReport) {
      store.setPhase({ type: "empty" });
      store.pushMessage(ritiText(EMPTY_REPORT_TEXT));
      store.pushMessage(
        ritiQuickReplies([
          { id: "guide", label: "다른 훈련 안내", action: { type: "guide-other-training" } },
        ]),
      );

      return () => store.reset();
    }

    store.setPhase({ type: "select" });
    store.pushMessage(
      ritiText(
        `${nickname}님, 가장 최근에 ${recentReport.bookTitle}${josa(recentReport.bookTitle, "을", "를")} 완독하시고\n독후감을 작성하셨네요!!\n\n어느 독후감으로 논리를 확장해볼까요?`,
      ),
    );
    store.pushMessage(
      ritiQuickReplies([
        {
          id: "recent",
          label: recentReport.bookTitle,
          action: { type: "select-recent-report" },
        },
        { id: "list", label: "독후감 목록보기", action: { type: "open-report-list" } },
      ]),
    );

    return () => store.reset();
  }, [isPending, recentReport, nickname]);

  const streamReply = useCallback(
    async (report: ReadingReport, text: string, userMessageId?: string) => {
      const store = useBookReportChatStore.getState();
      const currentTurn = store.turn;

      const reply = ritiText("", true);
      store.pushMessage(reply);

      await start(
        { reportId: report.reportId, text, turn: currentTurn },
        {
          onDelta: (delta) => useBookReportChatStore.getState().appendText(reply.id, delta),
          onDone: () => {
            const next = useBookReportChatStore.getState();
            next.finishStreaming(reply.id);
            next.nextTurn();

            if (currentTurn !== ANOTHER_VIEW_TURN) return;

            next.pushMessage(
              ritiQuickReplies([
                { id: "another-view", label: "다른 관점 보기", action: { type: "another-view" } },
              ]),
            );
          },
          onError: () => {
            const next = useBookReportChatStore.getState();
            next.removeMessage(reply.id);
            if (userMessageId) next.markFailed(userMessageId, true);
          },
        },
      );
    },
    [start],
  );

  const selectReport = useCallback(
    async (report: ReadingReport) => {
      const store = useBookReportChatStore.getState();

      store.pushMessage(userText(report.bookTitle));
      store.setPhase({ type: "analyzing", report });

      await delay(USER_ECHO_DELAY_MS);

      const analyzing = useBookReportChatStore.getState();
      analyzing.pushMessage(ritiReportCard(report));

      const loading = ritiLoading();
      analyzing.pushMessage(loading);

      await startBookReportSession(report);
      await delay(ANALYZE_DURATION_MS);

      const next = useBookReportChatStore.getState();
      next.removeMessage(loading.id);
      next.pushMessage(ritiPlainText(ANALYZING_TEXT));
      next.pushMessage(ritiPlainText(ANALYZED_TEXT));

      await delay(ANALYZED_HOLD_MS);

      // 새 채팅창으로 전환
      const chatting = useBookReportChatStore.getState();
      chatting.clearMessages();
      chatting.setPhase({ type: "chatting", report });

      await streamReply(report, "", undefined);
    },
    [streamReply],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const current = useBookReportChatStore.getState().phase;
      if (current.type !== "chatting" || isStreaming) return;

      const message = userText(text);
      useBookReportChatStore.getState().pushMessage(message);

      await streamReply(current.report, text, message.id);
    },
    [isStreaming, streamReply],
  );

  const retryMessage = useCallback(
    async (messageId: string, text: string) => {
      const current = useBookReportChatStore.getState().phase;
      if (current.type !== "chatting" || isStreaming) return;

      useBookReportChatStore.getState().markFailed(messageId, false);

      await streamReply(current.report, text, messageId);
    },
    [isStreaming, streamReply],
  );

  const showSummary = useCallback(() => {
    const store = useBookReportChatStore.getState();
    if (store.phase.type !== "chatting") return;

    store.pushMessage(ritiThoughtSummary(mockThoughtComparison));
    store.setPhase({
      type: "summary",
      report: store.phase.report,
      thought: mockThoughtComparison,
    });
  }, []);

  const endChat = useCallback(async () => {
    const store = useBookReportChatStore.getState();
    if (store.phase.type !== "summary") return;

    store.pushMessage(ritiText(ENDING_TEXT));
    store.pushMessage(systemText(ENDED_SYSTEM_TEXT));
    store.setPhase({ type: "ended", report: store.phase.report });

    await delay(ENDED_REDIRECT_MS);
    navigate("/training/complete");
  }, [navigate]);

  // 뒤로가기 이탈 처리
  const leaveChat = useCallback(
    async (save: boolean) => {
      if (save) await endBookReportSession();

      navigate(-1);
    },
    [navigate],
  );

  const applyToReport = useCallback(async () => {
    await applyChatToReport();
    await endChat();
  }, [endChat]);

  const saveAndStop = useCallback(async () => {
    await endBookReportSession();
    await endChat();
  }, [endChat]);

  const continueAnotherTopic = useCallback(async () => {
    const store = useBookReportChatStore.getState();
    if (store.phase.type !== "summary") return;

    store.setPhase({ type: "chatting", report: store.phase.report });

    await streamReply(store.phase.report, "다른 주제로 이어가기", undefined);
  }, [streamReply]);

  const handleQuickReply = useCallback(
    async (reply: QuickReply) => {
      const store = useBookReportChatStore.getState();

      if (reply.action.type === "select-recent-report") {
        if (recentReport) await selectReport(recentReport);
        return;
      }

      // 이해력 증진 화면 이동
      if (reply.action.type === "go-comprehension") return;

      store.pushMessage(userText(reply.label));

      await delay(USER_ECHO_DELAY_MS);

      switch (reply.action.type) {
        case "open-report-list":
          setIsSheetOpen(true);
          return;

        case "another-view":
          showSummary();
          return;

        case "guide-other-training": {
          const next = useBookReportChatStore.getState();
          next.pushMessage(ritiText(`${nickname}님, ${COMPREHENSION_GUIDE_TEXT}`));
          next.pushMessage(
            ritiQuickReplies([
              {
                id: "comprehension",
                label: "이해력 증진 훈련 받으러가기",
                action: { type: "go-comprehension" },
                link: true,
              },
            ]),
          );
          return;
        }
      }
    },
    [nickname, recentReport, selectReport, showSummary],
  );

  return {
    phase,
    messages,
    reports,
    isStreaming,
    isSheetOpen,
    openSheet: () => setIsSheetOpen(true),
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
    continueAnotherTopic,
    saveAndStop,
  };
};
