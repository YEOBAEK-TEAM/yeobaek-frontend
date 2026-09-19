import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import Header from "@/components/common/header/Header";
import SectionState from "@/components/common/section/SectionState";
import ReportEditorForm from "@/components/library/report/editor/ReportEditorForm";
import { REPORT_EDITOR } from "@/constants/library/report";
import { useReportDetail } from "@/hooks/library/report/useReportEditor";
import { useUnlockedBooks } from "@/hooks/library/report/useReportQueries";
import { getApiErrorMessage } from "@/utils/common/getApiErrorMessage";
import { toNewReportEditorView } from "@/utils/library/report/toReportView";

type ReportEditorLocationState = {
  bookTitle?: string;
} | null;

const toId = (value: string | null | undefined) => {
  const id = Number(value);
  return value && Number.isInteger(id) && id > 0 ? id : null;
};

export default function ReportEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportId: reportIdParam } = useParams();
  const [params] = useSearchParams();

  const reportId = toId(reportIdParam);
  const bookId = toId(params.get("bookId"));
  const stateBookTitle = (location.state as ReportEditorLocationState)?.bookTitle;

  const detailQuery = useReportDetail(reportId);

  // 새 독후감을 주소로 바로 열면 해금 목록에서 책 제목 확인
  const unlockedQuery = useUnlockedBooks(reportId === null && bookId !== null && !stateBookTitle);
  const bookTitle =
    stateBookTitle ?? unlockedQuery.data?.find((book) => book.bookId === bookId)?.title;

  const editor =
    reportId !== null
      ? detailQuery.data
      : bookId !== null && bookTitle
        ? toNewReportEditorView(bookId, bookTitle)
        : undefined;

  if (editor) return <ReportEditorForm editor={editor} />;

  const isNewReport = reportId === null;
  const isPending = isNewReport
    ? bookId !== null && unlockedQuery.isPending
    : detailQuery.isPending;
  const isError = isNewReport ? !isPending : detailQuery.isError;

  const errorText = isNewReport
    ? unlockedQuery.isError
      ? REPORT_EDITOR.loadErrorText
      : REPORT_EDITOR.bookNotFoundText
    : getApiErrorMessage(detailQuery.error, REPORT_EDITOR.loadErrorText);

  const retry = () => void (isNewReport ? unlockedQuery.refetch() : detailQuery.refetch());

  return (
    <main className="flex min-h-dvh flex-col">
      <Header title="" onBack={() => navigate(-1)} />

      <div className="px-5.5 pt-4">
        {isPending && !isError ? (
          <SectionState isError={false} onRetry={retry} className="h-96" />
        ) : (
          <>
            <SectionState isError onRetry={retry} className="h-60" />
            <p role="alert" className="mt-3 text-center text-[14px] break-keep text-[#8F8F8F]">
              {errorText}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
