import { useEffect, useRef, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Link } from "react-router-dom";
import BookTextReader from "./components/BookTextReader";
import { useReaderData } from "./utils/useReaderData";
import ReaderPageDeck from "./components/ReaderPageDeck";
import { useReaderPagination } from "./utils/useReaderPagination";
import { readerPageContainsAnchor } from "./utils/paginateReaderText";
import "./BookReadPage.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
const pdfOptions = { wasmUrl: "/wasm/" };

function Icon({
  name,
  filled = false,
}: {
  name: "heart" | "comment" | "bookmark";
  filled?: boolean;
}) {
  const paths = {
    heart: "M12 20S3 14.5 3 8.5C3 3.5 9 2.5 12 7c3-4.5 9-3.5 9 1.5C21 14.5 12 20 12 20Z",
    comment:
      "M5 3.5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3v4l-5-4H5a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2Z",
    bookmark: "M6 3h12v18l-6-4-6 4V3Z",
  };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export default function BookReadPage() {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const {
    readerPages,
    pageIndex,
    loading,
    error,
    prepared,
    goToPage: navigate,
  } = useReaderPagination(pdf, bodyRef);
  const pageNumber = pageIndex + 1;
  const currentPage = readerPages[pageIndex];
  const pdfPage = currentPage?.pdfPage ?? 1;
  const ready = !!currentPage && !loading && !error;
  const { data, setData, storageError } = useReaderData();
  const [commentOpen, setCommentOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [commentPages, setCommentPages] = useState<number[]>([]);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const elements = [document.documentElement, document.body];
    const previous = elements.map((element) => element.style.overflow);
    elements.forEach((element) => {
      element.style.overflow = "hidden";
    });
    return () =>
      elements.forEach((element, index) => {
        element.style.overflow = previous[index];
      });
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  const goToPage = (nextPage: number) => {
    if (!ready) return;
    navigate(nextPage - 1);
    setCommentOpen(false);
    setNotice("");
    window.getSelection()?.removeAllRanges();
  };
  const visiblePdfPages = currentPage?.pdfPages ?? [pdfPage];
  const comments = data.comments.filter((comment) =>
    (comment.pages ?? [comment.page]).some((page) => visiblePdfPages.includes(page)),
  );
  const shownComments = comments.filter((comment) =>
    (comment.pages ?? [comment.page]).some((page) => commentPages.includes(page)),
  );
  const bookmarks =
    data.readerBookmarks ?? data.bookmarks.map((page) => ({ pdfPage: page, start: 0 }));
  const bookmarked =
    !!currentPage && bookmarks.some((bookmark) => readerPageContainsAnchor(currentPage, bookmark));
  const openComments = (text = "", pages = visiblePdfPages) => {
    setQuote(text);
    setCommentPages(pages);
    setDraft("");
    setCommentOpen(true);
  };
  return (
    <main className="book-reader bg-[#8C8149]">
      <header className="book-reader__header">
        <Link to="/library" aria-label="서재로 돌아가기" className="book-reader__back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m15 5-7 7 7 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <h1>어린 왕자</h1>
      </header>
      <div className="book-reader__body" ref={bodyRef}>
        <Document
          className="book-reader__document"
          file="/books/little-prince.pdf"
          options={pdfOptions}
          onLoadSuccess={setPdf}
          loading={
            <p role="status" className="book-reader__message">
              책을 불러오고 있습니다.
            </p>
          }
          error={
            <p role="alert" className="book-reader__message">
              PDF를 불러오지 못했습니다. 새로고침해 주세요.
            </p>
          }
        >
          {pdf && loading && (
            <p role="status" className="book-reader__message">
              독서 페이지를 준비하고 있습니다. ({prepared}/{pdf.numPages})
            </p>
          )}
          {error && (
            <p role="alert" className="book-reader__message">
              {error}
            </p>
          )}
          {ready && (
            <ReaderPageDeck
              key={currentPage.id}
              pages={readerPages}
              index={pageIndex}
              onNavigate={(index) => goToPage(index + 1)}
              renderPage={(page, active) => (
                <BookTextReader
                  key={page.id}
                  page={page}
                  active={active}
                  highlights={data.highlights}
                  words={data.words}
                  comments={data.comments}
                  onHighlight={(selection, color) => {
                    setData((current) => ({
                      ...current,
                      highlights: [
                        ...current.highlights,
                        ...selection.ranges.map(({ pdfPage, ...range }) => ({
                          ...range,
                          color,
                          page: pdfPage,
                          id: crypto.randomUUID(),
                        })),
                      ],
                    }));
                    setNotice("문장을 수집했습니다.");
                  }}
                  onWord={(word) => {
                    setData((current) => ({
                      ...current,
                      words: current.words.some(
                        (entry) => JSON.stringify(entry.ranges) === JSON.stringify(word.ranges),
                      )
                        ? current.words
                        : [...current.words, { ...word, id: crypto.randomUUID() }],
                    }));
                    setNotice("선택한 텍스트를 이 기기의 단어장에 저장했습니다.");
                  }}
                  onComment={(selection, text) => {
                    if (!text.trim()) return;
                    setData((current) => ({
                      ...current,
                      comments: [
                        ...current.comments,
                        {
                          id: crypto.randomUUID(),
                          page: selection.ranges[0].pdfPage,
                          pages: [...new Set(selection.ranges.map((range) => range.pdfPage))],
                          ranges: selection.ranges,
                          quote: selection.text,
                          text: text.trim(),
                        },
                      ],
                    }));
                    setNotice("댓글을 저장했습니다.");
                  }}
                />
              )}
            />
          )}
        </Document>
      </div>
      {(notice || storageError) && (
        <p role="status" className="book-reader__notice">
          {storageError ? "기기에 저장할 수 없어 이번 방문 동안만 유지됩니다." : notice}
        </p>
      )}
      <footer className="book-reader__footer">
        <div className="book-reader__progress">
          <input
            type="range"
            aria-label="독서 페이지 선택"
            aria-valuetext={
              ready ? `${readerPages.length}페이지 중 ${pageNumber}페이지` : "독서 페이지 준비 중"
            }
            min={1}
            max={readerPages.length || 1}
            value={pageNumber}
            disabled={!ready || readerPages.length <= 1}
            style={{
              background: `linear-gradient(to right, #595854 ${ready && readerPages.length > 1 ? (pageIndex / (readerPages.length - 1)) * 100 : 0}%, #eeeede 0)`,
            }}
            onChange={(event) => goToPage(Number(event.target.value))}
          />
          <span aria-live="polite">{ready ? `${pageNumber}/${readerPages.length}` : "—/—"}</span>
        </div>
        <div className="book-reader__actions">
          <button
            type="button"
            aria-label="좋아요"
            aria-pressed={data.liked}
            onClick={() => setData((current) => ({ ...current, liked: !current.liked }))}
          >
            <Icon name="heart" filled={data.liked} />
            <span>{data.liked ? 1 : 0}</span>
          </button>
          <button
            type="button"
            aria-label={`이 페이지 댓글 ${comments.length}개`}
            disabled={!ready}
            onClick={() => openComments()}
          >
            <Icon name="comment" />
            <span>{comments.length}</span>
          </button>
          <button
            type="button"
            className="book-reader__bookmark"
            aria-label={`${pageNumber}페이지 북마크`}
            aria-pressed={bookmarked}
            disabled={!ready}
            onClick={() =>
              setData((current) => ({
                ...current,
                readerBookmarks: bookmarked
                  ? bookmarks.filter((bookmark) => !readerPageContainsAnchor(currentPage, bookmark))
                  : [
                      ...bookmarks,
                      { pdfPage, start: currentPage.start, imageId: currentPage.imageId },
                    ],
              }))
            }
          >
            <Icon name="bookmark" filled={bookmarked} />
          </button>
        </div>
      </footer>
      {commentOpen && (
        <div className="book-reader__sheet-backdrop" onClick={() => setCommentOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reader-comments-title"
            className="book-reader__sheet"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") setCommentOpen(false);
              if (event.key === "Tab") {
                const controls = Array.from(
                  event.currentTarget.querySelectorAll<HTMLElement>(
                    "button:not(:disabled), textarea",
                  ),
                );
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <div className="book-reader__sheet-heading">
              <h2 id="reader-comments-title">PDF {commentPages.join(", ")}페이지 댓글</h2>
              <button type="button" onClick={() => setCommentOpen(false)} aria-label="댓글 닫기">
                닫기
              </button>
            </div>
            <p className="book-reader__storage-note">댓글과 수집 기록은 이 기기에 저장됩니다.</p>
            <div className="book-reader__comments">
              {shownComments.length ? (
                shownComments.map((comment) => (
                  <div key={comment.id}>
                    {comment.quote && <blockquote>{comment.quote}</blockquote>}
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p>이 페이지에 첫 의견을 남겨보세요.</p>
              )}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!draft.trim()) return;
                setData((current) => ({
                  ...current,
                  comments: [
                    ...current.comments,
                    {
                      id: crypto.randomUUID(),
                      page: commentPages[0] ?? pdfPage,
                      pages: commentPages,
                      quote,
                      text: draft.trim(),
                    },
                  ],
                }));
                setDraft("");
                setQuote("");
              }}
            >
              {quote && <blockquote>{quote}</blockquote>}
              <textarea
                autoFocus
                aria-label="댓글 내용"
                placeholder="읽으며 떠오른 생각을 남겨주세요."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={2000}
              />
              <button type="submit" disabled={!draft.trim()} className="book-reader__submit">
                댓글 남기기
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
