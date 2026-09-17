import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Header from "@/components/common/header/Header";
import CommonModal from "@/components/common/modal/CommonModal";
import StepProgressBar from "@/components/common/progress/StepProgressBar";
import SectionState from "@/components/common/section/SectionState";
import ReportWriteFlowModals from "@/components/library/report/ReportWriteFlowModals";
import GradingView from "@/components/library/unlock-quiz/GradingView";
import QuizFooterButton from "@/components/library/unlock-quiz/QuizFooterButton";
import QuizQuestion from "@/components/library/unlock-quiz/QuizQuestion";
import UnlockFailView from "@/components/library/unlock-quiz/UnlockFailView";
import UnlockSuccessView from "@/components/library/unlock-quiz/UnlockSuccessView";
import { LIBRARY_REPORT_TAB_STATE, MODAL_ANSWER } from "@/constants/library/report";
import { GRADING_HOLD_MS, GRADING_STEP_MS, UNLOCK_QUIZ } from "@/constants/library/unlockQuiz";
import { useBackGuard } from "@/hooks/common/useBackGuard";
import { useReportWriteFlow } from "@/hooks/library/report/useReportWriteFlow";
import {
  useGradeUnlockQuiz,
  useUnlockQuiz,
} from "@/hooks/library/unlock-quiz/useUnlockQuizQueries";
import { useUnlockQuizStore } from "@/stores/library/unlockQuiz";
import { wait, withMinimumDelay } from "@/utils/common/withMinimumDelay";

type QuizPhase = "solving" | "grading" | "unlocked" | "failed";

const SLIDE_IN_KEYFRAMES: Keyframe[] = [
  { opacity: 0, transform: "translateX(20px)" },
  { opacity: 1, transform: "translateX(0)" },
];

// 퀴즈·채점·결과를 한 기록 안에서 전환해 뒤로가기 시 바로 뷰어로 복귀
export default function UnlockQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookId: bookIdParam } = useParams();

  const bookId = Number(bookIdParam);

  const quizQuery = useUnlockQuiz(bookId);
  const quiz = quizQuery.data;

  const answers = useUnlockQuizStore((state) => state.answers);
  const selectAnswer = useUnlockQuizStore((state) => state.selectAnswer);
  const resetAnswers = useUnlockQuizStore((state) => state.reset);

  const gradeQuiz = useGradeUnlockQuiz();
  const writeFlow = useReportWriteFlow();

  const [phase, setPhase] = useState<QuizPhase>("solving");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isGradingDone, setIsGradingDone] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);

  const questionRef = useRef<HTMLDivElement>(null);

  // 다른 책 퀴즈의 선택값이 남지 않도록 진입·이탈 시 초기화
  useEffect(() => {
    resetAnswers();
    return resetAnswers;
  }, [bookId, resetAnswers]);

  // 문제 전환 시 맨 위에서 가볍게 등장
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    questionRef.current?.animate(SLIDE_IN_KEYFRAMES, { duration: 260, easing: "ease-out" });
  }, [questionIndex]);

  const leave = () => (location.key === "default" ? navigate("/library") : navigate(-1));

  // 헤더 뒤로가기와 폰·브라우저 뒤로가기 공통 동작, 첫 문제에서는 나중에 풀기 확인
  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex((index) => index - 1);
      return;
    }

    setIsExitOpen(true);
  };

  const { release } = useBackGuard(Boolean(quiz) && phase === "solving", handleBack);

  if (!quiz) {
    return (
      <main className="flex min-h-dvh flex-col">
        <Header title="" onBack={leave} />

        <div className="px-8.5 pt-6">
          <SectionState
            isError={quizQuery.isError}
            onRetry={() => void quizQuery.refetch()}
            className="h-96"
          />
          {quizQuery.isError && <p className="sr-only">{UNLOCK_QUIZ.loadErrorText}</p>}
        </div>
      </main>
    );
  }

  const { questions } = quiz;
  const question = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;
  const selectedChoiceId = answers[question.questionId];

  const submit = async () => {
    setPhase("grading");
    setIsGradingDone(false);

    try {
      const { result } = await withMinimumDelay(
        gradeQuiz.mutateAsync({ quizId: quiz.quizId, bookId, answers }),
        GRADING_STEP_MS * questions.length,
      );

      setIsGradingDone(true);
      await wait(GRADING_HOLD_MS);

      if (result === "unlocked") {
        setPhase("unlocked");
        return;
      }

      // 한 문제라도 틀리면 정답은 알리지 않고 재도전 안내
      setPhase("failed");
    } catch {
      // 오류 상태는 mutation이 보관하고 채점 화면에서 재시도 안내
    }
  };

  // 새 문제를 받아 첫 문제부터 다시 풀기
  const retryQuiz = async () => {
    await quizQuery.refetch();
    gradeQuiz.reset();
    resetAnswers();
    setQuestionIndex(0);
    setPhase("solving");
  };

  const goNext = () => (isLastQuestion ? void submit() : setQuestionIndex((index) => index + 1));

  if (phase === "grading") {
    return (
      <GradingView
        questionCount={questions.length}
        isDone={isGradingDone}
        isError={gradeQuiz.isError}
        onRetry={() => void submit()}
        onExit={() => release(leave)}
      />
    );
  }

  if (phase === "failed") {
    return <UnlockFailView onLater={() => release(leave)} onRetry={() => void retryQuiz()} />;
  }

  if (phase === "unlocked") {
    return (
      <>
        <UnlockSuccessView
          bookTitle={quiz.bookTitle}
          onLater={() =>
            release(() => navigate("/library", { replace: true, state: LIBRARY_REPORT_TAB_STATE }))
          }
          onWrite={() =>
            release(
              () =>
                void writeFlow.writeBook(
                  { bookId, title: quiz.bookTitle },
                  { confirm: false, replace: true },
                ),
            )
          }
        />
        <ReportWriteFlowModals writeFlow={writeFlow} />
      </>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
      <Header title={UNLOCK_QUIZ.getTitle(quiz.bookTitle)} onBack={handleBack} />

      <StepProgressBar step={questionIndex + 1} totalSteps={questions.length} variant="quiz" />

      <div ref={questionRef} className="px-8.5 pt-11">
        <QuizQuestion
          key={question.questionId}
          number={questionIndex + 1}
          question={question}
          value={selectedChoiceId}
          onChange={(choiceId) => selectAnswer(question.questionId, choiceId)}
        />

        <div className="mt-13.5">
          <QuizFooterButton
            label={isLastQuestion ? UNLOCK_QUIZ.submitLabel : UNLOCK_QUIZ.nextLabel}
            disabled={!selectedChoiceId || gradeQuiz.isPending}
            onClick={goNext}
          />
        </div>
      </div>

      {isExitOpen && (
        <CommonModal
          message={UNLOCK_QUIZ.exitMessage}
          onClose={() => setIsExitOpen(false)}
          actions={[
            { label: MODAL_ANSWER.no, onClick: () => setIsExitOpen(false) },
            { label: MODAL_ANSWER.yes, onClick: () => release(leave) },
          ]}
        />
      )}
    </main>
  );
}
