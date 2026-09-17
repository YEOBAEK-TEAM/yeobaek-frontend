import { useCallback, useEffect, useId, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import CommonModal from "@/components/common/modal/CommonModal";
import ReportDateField from "@/components/library/report/editor/ReportDateField";
import ReportToast from "@/components/library/report/ReportToast";
import {
  LIBRARY_REPORT_TAB_STATE,
  MODAL_ANSWER,
  REPORT_EDITOR,
  REPORT_PATH,
  REPORT_SAVE_ERROR_FALLBACK,
  REPORT_SAVE_ERROR_MESSAGE,
  REPORT_TITLE_MAX_LENGTH,
} from "@/constants/library/report";
import { useSaveReportDraft, useSubmitReport } from "@/hooks/library/report/useReportEditor";

import type { ReportEditorResponse, ReportFormValues } from "@/types/library/report";

type ReportEditorFormProps = {
  editor: ReportEditorResponse;
};

const FIELD_CLASS =
  "w-full rounded-2xl border-2 border-[#D3D0C3] bg-[#F9FAFB] text-[16px] text-[#2C2A2B] outline-none placeholder:text-[#8F8F8F] focus-visible:border-[#A89F94]";

const LABEL_CLASS = "block px-3.5 text-[16px] font-bold text-[#4F4D4E]";

const toSaveErrorMessage = (error: Error) =>
  REPORT_SAVE_ERROR_MESSAGE[error.message] ?? REPORT_SAVE_ERROR_FALLBACK;

export default function ReportEditorForm({ editor }: ReportEditorFormProps) {
  const fieldId = useId();
  const navigate = useNavigate();
  const location = useLocation();

  const [reportId, setReportId] = useState(editor.reportId);
  const [values, setValues] = useState<ReportFormValues>({
    title: editor.title,
    reportDate: editor.reportDate,
    content: editor.content,
  });

  // 마지막으로 저장된 값, 비교해서 수정 여부 판단
  const [savedValues, setSavedValues] = useState(values);

  const [isExitOpen, setIsExitOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hideToast = useCallback(() => setToastMessage(null), []);

  const saveDraft = useSaveReportDraft();
  const submit = useSubmitReport();

  const isDirty =
    values.title !== savedValues.title ||
    values.reportDate !== savedValues.reportDate ||
    values.content !== savedValues.content;

  const canSubmit = values.title.trim().length > 0 && values.content.trim().length > 0;

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

  const request = { ...values, reportId, bookId: editor.bookId };

  const tempSave = (afterSave?: () => void) =>
    saveDraft.mutate(request, {
      onSuccess: ({ reportId: savedId }) => {
        setReportId(savedId);
        setSavedValues(values);

        if (afterSave) {
          afterSave();
          return;
        }

        // 새 독후감은 저장된 주소로 교체해 새로고침해도 이어서 작성
        if (reportId === null) navigate(REPORT_PATH.edit(savedId), { replace: true });
        setToastMessage(REPORT_EDITOR.savedToast);
      },
      onError: (error) => {
        setIsExitOpen(false);
        setToastMessage(toSaveErrorMessage(error));
      },
    });

  const handleBack = () => (isDirty ? setIsExitOpen(true) : leave());

  const handleSubmit = () =>
    submit.mutate(request, {
      // 제출 후 작성 화면 기록을 서재 독후감 탭으로 교체
      onSuccess: () => navigate("/library", { replace: true, state: LIBRARY_REPORT_TAB_STATE }),
      onError: (error) => setToastMessage(toSaveErrorMessage(error)),
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

        <label htmlFor={`${fieldId}-date`} className={`${LABEL_CLASS} mt-4`}>
          {REPORT_EDITOR.dateLabel}
        </label>
        <div className="mt-2.5">
          <ReportDateField
            id={`${fieldId}-date`}
            value={values.reportDate}
            onChange={(value) => updateValue("reportDate", value)}
          />
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
          disabled={saveDraft.isPending}
          aria-busy={saveDraft.isPending}
          className="h-13.5 rounded-xl bg-[#C1C1C1] text-[18px] font-bold text-[#1E1E1E] disabled:opacity-70"
        >
          {REPORT_EDITOR.tempSaveLabel}
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || submit.isPending}
          aria-busy={submit.isPending}
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
            { label: MODAL_ANSWER.no, onClick: leave },
            {
              label: MODAL_ANSWER.yes,
              onClick: () => tempSave(leave),
              isPending: saveDraft.isPending,
            },
          ]}
        />
      )}

      {toastMessage && <ReportToast message={toastMessage} onClose={hideToast} />}
    </main>
  );
}
