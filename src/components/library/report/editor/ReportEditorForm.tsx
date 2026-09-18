import { useEffect, useId, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import CommonModal from "@/components/common/modal/CommonModal";
import ReportDateField from "@/components/library/report/editor/ReportDateField";
import {
  LIBRARY_REPORT_TAB_STATE,
  MODAL_ANSWER,
  REPORT_EDITOR,
  REPORT_PATH,
  REPORT_SAVE_ERROR_FALLBACK,
  REPORT_TITLE_MAX_LENGTH,
} from "@/constants/library/report";
import { useBackGuard } from "@/hooks/common/useBackGuard";
import { useSaveReport } from "@/hooks/library/report/useReportEditor";
import { useToastStore } from "@/stores/common/toast";
import { getApiErrorMessage } from "@/utils/common/getApiErrorMessage";

import type { BookReviewStatus, ReportEditorView, ReportFormValues } from "@/types/library/report";

type ReportEditorFormProps = {
  editor: ReportEditorView;
};

const FIELD_CLASS =
  "w-full rounded-2xl border-2 border-[#D3D0C3] bg-[#F9FAFB] text-[16px] text-[#2C2A2B] outline-none placeholder:text-[#8F8F8F] focus-visible:border-[#A89F94]";

const LABEL_CLASS = "block px-3.5 text-[16px] font-bold text-[#4F4D4E]";

// 작성 조건 위반은 서버 안내 문구 그대로 표시
const toSaveErrorMessage = (error: Error) => getApiErrorMessage(error, REPORT_SAVE_ERROR_FALLBACK);

export default function ReportEditorForm({ editor }: ReportEditorFormProps) {
  const fieldId = useId();
  const navigate = useNavigate();
  const location = useLocation();

  const [reportId, setReportId] = useState(editor.reportId);
  const [values, setValues] = useState<ReportFormValues>({
    title: editor.title,
    content: editor.content,
  });

  // 마지막으로 저장된 값, 비교해서 수정 여부 판단
  const [savedValues, setSavedValues] = useState(values);

  const [isExitOpen, setIsExitOpen] = useState(false);

  const showToast = useToastStore((state) => state.showToast);

  const saveReport = useSaveReport();

  // 임시저장과 제출이 같은 요청이라 진행 중인 쪽 버튼에만 로딩 표시
  const pendingStatus = saveReport.isPending ? saveReport.variables.status : null;

  const isDirty = values.title !== savedValues.title || values.content !== savedValues.content;

  // 제목이나 본문 중 한 글자라도 있어야 임시저장, 둘 다 있어야 제출
  const hasAnyContent = values.title.trim().length > 0 || values.content.trim().length > 0;
  const canSubmit = values.title.trim().length > 0 && values.content.trim().length > 0;

  const shouldConfirmExit = isDirty && hasAnyContent;

  const { release } = useBackGuard(shouldConfirmExit, () => setIsExitOpen(true));

  // 새로고침·창 닫기 시 브라우저 기본 이탈 경고
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const updateValue = (key: keyof ReportFormValues, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const leave = () => (location.key === "default" ? navigate("/library") : navigate(-1));

  const toRequest = (status: BookReviewStatus) => ({
    ...values,
    status,
    reviewId: reportId,
    bookId: editor.bookId,
  });

  const tempSave = (afterSave?: () => void) =>
    saveReport.mutate(toRequest("DRAFT"), {
      onSuccess: ({ reviewId: savedId }) => {
        setReportId(savedId);
        setSavedValues(values);

        if (afterSave) {
          afterSave();
          return;
        }

        // 새 독후감은 저장된 주소로 교체해 새로고침해도 이어서 작성
        if (reportId === null) {
          release(() => navigate(REPORT_PATH.edit(savedId), { replace: true }));
        }
        showToast(REPORT_EDITOR.savedToast);
      },
      onError: (error) => {
        setIsExitOpen(false);
        showToast(toSaveErrorMessage(error), "error");
      },
    });

  // 비어 있으면 저장할 내용이 없으므로 확인 없이 나감
  const handleBack = () => (shouldConfirmExit ? setIsExitOpen(true) : release(leave));

  const handleSubmit = () =>
    saveReport.mutate(toRequest("PUBLISHED"), {
      // 제출 후 작성 화면 기록을 서재 독후감 탭으로 교체
      onSuccess: () =>
        release(() => {
          showToast(REPORT_EDITOR.submittedToast);
          navigate("/library", { replace: true, state: LIBRARY_REPORT_TAB_STATE });
        }),
      onError: (error) => showToast(toSaveErrorMessage(error), "error"),
    });

  return (
    <main className="flex min-h-dvh flex-col">
      <Header title={`${editor.bookTitle}${REPORT_EDITOR.titleSuffix}`} onBack={handleBack} />

      <div className="flex flex-1 flex-col px-5.5 pb-4">
        <label htmlFor={`${fieldId}-title`} className={`${LABEL_CLASS} mt-2`}>
          {REPORT_EDITOR.titleLabel}
        </label>
        <input
          id={`${fieldId}-title`}
          value={values.title}
          maxLength={REPORT_TITLE_MAX_LENGTH}
          placeholder={REPORT_EDITOR.titlePlaceholder}
          autoComplete="off"
          onChange={(event) => updateValue("title", event.target.value)}
          className={`${FIELD_CLASS} mt-2.5 h-15 px-7`}
        />

        <p className={`${LABEL_CLASS} mt-4`}>{REPORT_EDITOR.dateLabel}</p>
        <div className="mt-2.5">
          <ReportDateField id={`${fieldId}-date`} label={editor.dateLabel} />
        </div>

        <label htmlFor={`${fieldId}-content`} className="sr-only">
          {REPORT_EDITOR.contentLabel}
        </label>
        <textarea
          id={`${fieldId}-content`}
          value={values.content}
          placeholder={REPORT_EDITOR.contentPlaceholder}
          onChange={(event) => updateValue("content", event.target.value)}
          className={`${FIELD_CLASS} mt-3.5 min-h-60 flex-1 resize-none px-8 py-8 leading-6`}
        />
      </div>

      <div className="sticky bottom-0 grid grid-cols-2 gap-2 bg-[#FFFEFB] px-5.5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        <button
          type="button"
          onClick={() => tempSave()}
          disabled={!hasAnyContent || saveReport.isPending}
          aria-busy={pendingStatus === "DRAFT"}
          className="h-13.5 rounded-xl bg-[#C1C1C1] text-[18px] font-bold text-[#1E1E1E] disabled:opacity-70"
        >
          {REPORT_EDITOR.tempSaveLabel}
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || saveReport.isPending}
          aria-busy={pendingStatus === "PUBLISHED"}
          className="h-13.5 rounded-xl bg-[#B8BC9F] text-[18px] font-bold text-white disabled:bg-[#D5D7C9]"
        >
          {REPORT_EDITOR.submitLabel}
        </button>
      </div>

      {isExitOpen && (
        <CommonModal
          message={REPORT_EDITOR.exitMessage}
          onClose={() => setIsExitOpen(false)}
          actions={[
            { label: MODAL_ANSWER.no, onClick: () => release(leave) },
            {
              label: MODAL_ANSWER.yes,
              onClick: () => tempSave(() => release(leave)),
              isPending: saveReport.isPending,
            },
          ]}
        />
      )}
    </main>
  );
}
