import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PdfViewerProps = {
  pdfUrl: string;
};

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document file={pdfUrl} onLoadSuccess={handleLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
        >
          이전
        </button>

        <span>
          {pageNumber} / {numPages}
        </span>

        <button
          type="button"
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
          disabled={pageNumber === numPages}
        >
          다음
        </button>
      </div>
    </div>
  );
}
