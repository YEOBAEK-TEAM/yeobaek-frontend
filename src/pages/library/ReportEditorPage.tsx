import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Header from "@/components/common/header/Header";
import SectionState from "@/components/common/section/SectionState";
import ReportEditorForm from "@/components/library/report/editor/ReportEditorForm";
import { REPORT_EDITOR } from "@/constants/library/report";
import { useReportEditor } from "@/hooks/library/report/useReportEditor";

const toId = (value: string | null | undefined) => {
  const id = Number(value);
  return value && Number.isInteger(id) ? id : null;
};

export default function ReportEditorPage() {
  const navigate = useNavigate();
  const { reportId: reportIdParam } = useParams();
  const [params] = useSearchParams();

  const reportId = toId(reportIdParam);
  const bookId = toId(params.get("bookId"));

  const { data, isPending, isError, refetch } = useReportEditor(reportId, bookId);

  if (data) return <ReportEditorForm editor={data} />;

  return (
    <main className="flex min-h-dvh flex-col">
      <Header title="" onBack={() => navigate(-1)} />

      <div className="px-5.5 pt-4">
        {isPending && !isError ? (
          <SectionState isError={false} onRetry={() => void refetch()} className="h-96" />
        ) : (
          <>
            <SectionState isError onRetry={() => void refetch()} className="h-60" />
            <p className="sr-only">{REPORT_EDITOR.loadErrorText}</p>
          </>
        )}
      </div>
    </main>
  );
}
