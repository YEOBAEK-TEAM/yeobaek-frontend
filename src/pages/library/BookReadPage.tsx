import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type ReaderPage = {
  pdfPageNumber: number;
  side: "single" | "left" | "right";
};

export default function BookReadPage() {
  const [readerPages, setReaderPages] = useState<ReaderPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // 화면 크기에 따라 PDF 크기 조절
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const handleDocumentLoad = async (pdf: {
    numPages: number;
    getPage: (pageNumber: number) => Promise<{
      getViewport: (options: { scale: number }) => {
        width: number;
        height: number;
      };
    }>;
  }) => {
    const pages: ReaderPage[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });

      const isSpread = viewport.width > viewport.height;

      if (isSpread) {
        // 가로형 PDF → 왼쪽 / 오른쪽으로 분리
        pages.push({
          pdfPageNumber: i,
          side: "left",
        });

        pages.push({
          pdfPageNumber: i,
          side: "right",
        });
      } else {
        // 세로형 PDF → 한 페이지 그대로
        pages.push({
          pdfPageNumber: i,
          side: "single",
        });
      }
    }

    setReaderPages(pages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, readerPages.length - 1));
  };

  const page = readerPages[currentPage];

  return (
    <main className="flex min-h-screen flex-col">
      {/* 페이지 컨트롤 */}
      <div className="flex items-center justify-between px-5 py-4">
        <button type="button" onClick={handlePrev} disabled={currentPage === 0}>
          이전
        </button>

        <span>{readerPages.length > 0 ? `${currentPage + 1} / ${readerPages.length}` : ""}</span>

        <button type="button" onClick={handleNext} disabled={currentPage >= readerPages.length - 1}>
          다음
        </button>
      </div>

      {/* PDF 영역 */}
      <div ref={containerRef} className="w-full overflow-hidden">
        <Document file="/books/little-prince.pdf" onLoadSuccess={handleDocumentLoad}>
          {page && containerWidth > 0 && (
            <>
              {page.side === "single" ? (
                // 일반 한 페이지 PDF
                <Page pageNumber={page.pdfPageNumber} width={containerWidth} />
              ) : (
                // 두 페이지가 붙어있는 PDF
                <div
                  style={{
                    width: containerWidth,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: containerWidth * 2,
                      transform:
                        page.side === "right"
                          ? `translateX(-${containerWidth}px)`
                          : "translateX(0)",
                    }}
                  >
                    <Page pageNumber={page.pdfPageNumber} width={containerWidth * 2} />
                  </div>
                </div>
              )}
            </>
          )}
        </Document>
      </div>
    </main>
  );
}
