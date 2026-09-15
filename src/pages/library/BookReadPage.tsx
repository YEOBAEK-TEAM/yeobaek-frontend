import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import ReaderSettingsPanel from "./components/ReaderSettingsPanel";
import { READER_FONTS, useReaderSettings } from "./utils/useReaderSettings";
import { Document, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Link } from "react-router-dom";

import BookTextReader from "./components/BookTextReader";
import ReaderCommentsSheet from "./components/ReaderCommentsSheet";
import ReaderPageDeck from "./components/ReaderPageDeck";

import { useReaderData } from "./utils/useReaderData";
import { useReaderPagination } from "./utils/useReaderPagination";
import { readerPageContainsAnchor } from "./utils/paginateReaderText";
import { getCommentReaderPageIndex } from "./utils/readerComments";

import { readerUser } from "../../mocks/readerUser";

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
  const { settings, updateSettings, storageError: settingsStorageError } = useReaderSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    readerPages,
    pageIndex,
    loading,
    error,
    prepared,
    goToPage: navigate,
  } = useReaderPagination(
    pdf,
    bodyRef,
    `${settings.fontSize}:${settings.lineHeight}:${settings.fontFamily}`,
  );

  const pageNumber = pageIndex + 1;
  const currentPage = readerPages[pageIndex];
  const pdfPage = currentPage?.pdfPage ?? 1;

  const ready = !!currentPage && !loading && !error;

  const { data, setData, storageError } = useReaderData();

  const [commentOpen, setCommentOpen] = useState(false);
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

  // 현재 reader page의 원댓글만 가져오기
  const comments = data.comments.filter(
    (comment) =>
      !comment.parentCommentId &&
      !comment.replyTo &&
      comment.type !== "reply" &&
      getCommentReaderPageIndex(comment, readerPages) === pageIndex,
  );

  const bookmarks =
    data.readerBookmarks ??
    data.bookmarks.map((page) => ({
      pdfPage: page,
      start: 0,
    }));

  const bookmarked =
    !!currentPage && bookmarks.some((bookmark) => readerPageContainsAnchor(currentPage, bookmark));

  const openComments = () => {
    setCommentOpen(true);
  };

  return (
    <main
      className="book-reader"
      style={
        {
          "--reader-font-size": `${settings.fontSize}px`,
          "--reader-line-height": settings.lineHeight,
          "--reader-font-family": READER_FONTS[settings.fontFamily],
          "--reader-background": settings.backgroundColor,
          "--reader-foreground": settings.backgroundColor === "#000000" ? "#e7e5dd" : "#595854",
        } as CSSProperties
      }
    >
      {/* Header */}
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
        <button
          type="button"
          aria-label="읽기 설정"
          aria-haspopup="dialog"
          aria-expanded={settingsOpen}
          className="absolute -right-1 flex h-11 w-11 items-center justify-center !text-base !font-semibold"
          onClick={() => setSettingsOpen(true)}
        >
          Aa
        </button>
      </header>

      {/* Reader */}
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
              renderPage={(page, active, onSwipeDisabledChange) => (
                <BookTextReader
                  key={page.id}
                  page={page}
                  active={active}
                  onSwipeDisabledChange={onSwipeDisabledChange}
                  highlights={data.highlights}
                  words={data.words}
                  comments={data.comments}
                  onUpdateHighlight={(id, color) => {
                    setData((current) => ({
                      ...current,
                      highlights: color
                        ? current.highlights.map((entry) =>
                            entry.id === id
                              ? {
                                  ...entry,
                                  color,
                                }
                              : entry,
                          )
                        : current.highlights.filter((entry) => entry.id !== id),
                    }));

                    setNotice("변경사항이 저장됐습니다");
                  }}
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
                        : [
                            ...current.words,
                            {
                              ...word,
                              id: crypto.randomUUID(),
                            },
                          ],
                    }));
                  }}
                  onComment={(selection, text) => {
                    if (!text.trim()) return;

                    setData((current) => ({
                      ...current,
                      comments: [
                        ...current.comments,
                        {
                          id: crypto.randomUUID(),
                          type: "sentence",
                          user: readerUser,
                          createdAt: new Date().toISOString(),
                          page: selection.ranges[0].pdfPage,
                          pages: [...new Set(selection.ranges.map((range) => range.pdfPage))],
                          ranges: selection.ranges,
                          quote: selection.text,
                          text: text.trim(),
                        },
                      ],
                    }));

                    setNotice("댓글 작성 완료!");
                  }}
                />
              )}
            />
          )}
        </Document>
      </div>

      {/* Reader Notice */}
      {(notice || storageError || settingsStorageError) && (
        <p
          role="status"
          className={`book-reader__notice${
            notice === "댓글 작성 완료!" && !storageError ? " book-reader__notice--comment" : ""
          }`}
        >
          {notice === "댓글 작성 완료!" && !storageError && (
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="m4 12 5 5L20 6" />
            </svg>
          )}

          {storageError || settingsStorageError
            ? "기기에 저장할 수 없어 이번 방문 동안만 유지됩니다."
            : notice}
        </p>
      )}

      {/* Footer */}
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
              background: `linear-gradient(to right, #595854 ${
                ready && readerPages.length > 1 ? (pageIndex / (readerPages.length - 1)) * 100 : 0
              }%, #eeeede 0)`,
            }}
            onChange={(event) => goToPage(Number(event.target.value))}
          />

          <span aria-live="polite">{ready ? `${pageNumber}/${readerPages.length}` : "—/—"}</span>
        </div>

        <div className="book-reader__actions">
          {/* 좋아요 */}
          <button
            type="button"
            aria-label="좋아요"
            aria-pressed={data.liked}
            onClick={() =>
              setData((current) => ({
                ...current,
                liked: !current.liked,
              }))
            }
          >
            <Icon name="heart" filled={data.liked} />

            <span>{data.liked ? 1 : 0}</span>
          </button>

          {/* 댓글 */}
          <button
            type="button"
            aria-label={`이 페이지 댓글 ${comments.length}개`}
            disabled={!ready}
            onClick={openComments}
          >
            <Icon name="comment" />
            <span>{comments.length}</span>
          </button>

          {/* 북마크 */}
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
                      {
                        pdfPage,
                        start: currentPage.start,
                        imageId: currentPage.imageId,
                      },
                    ],
              }))
            }
          >
            <Icon name="bookmark" filled={bookmarked} />
          </button>
        </div>
      </footer>

      {/* Comments */}
      {commentOpen && ready && (
        <ReaderCommentsSheet
          replies={data.comments.filter(
            (comment) => !!(comment.parentCommentId || comment.replyTo),
          )}
          comments={comments}
          pageNumber={pageNumber}
          reportedCommentIds={data.reportedCommentIds ?? []}
          onEdit={(id, text) => {
            if (!text.trim() || text.length > 200) {
              return;
            }

            setData((current) => ({
              ...current,
              comments: current.comments.map((comment) =>
                comment.id === id
                  ? {
                      ...comment,
                      text: text.trim(),
                    }
                  : comment,
              ),
            }));
          }}
          onReport={(id) =>
            setData((current) => ({
              ...current,
              reportedCommentIds: [...new Set([...(current.reportedCommentIds ?? []), id])],
            }))
          }
          onClose={() => setCommentOpen(false)}
          onSubmit={(text, replyTo) => {
            if (!text.trim() || (replyTo && text.length > 200)) {
              return;
            }

            const parent = replyTo ? comments.find((comment) => comment.id === replyTo) : undefined;

            if (replyTo && !parent) return;

            setData((current) => ({
              ...current,
              comments: [
                ...current.comments,
                {
                  id: crypto.randomUUID(),

                  type: parent ? "reply" : "page",

                  user: readerUser,

                  createdAt: new Date().toISOString(),

                  page: parent?.page ?? pdfPage,

                  readerAnchor: parent?.readerAnchor ??
                    parent?.ranges?.[0] ?? {
                      pdfPage,
                      start: currentPage.start,
                      imageId: currentPage.imageId,
                    },

                  text: text.trim(),

                  ...(parent
                    ? {
                        parentCommentId: parent.id,
                      }
                    : {}),
                },
              ],
            }));
          }}
          onVote={(id, vote) =>
            setData((current) => ({
              ...current,

              comments: current.comments.map((comment) => {
                if (comment.id !== id) {
                  return comment;
                }

                const myVote = comment.myVote === vote ? undefined : vote;

                return {
                  ...comment,

                  myVote,

                  likes: Math.max(
                    0,
                    (comment.likes ?? 0) -
                      Number(comment.myVote === "like") +
                      Number(myVote === "like"),
                  ),

                  dislikes: Math.max(
                    0,
                    (comment.dislikes ?? 0) -
                      Number(comment.myVote === "dislike") +
                      Number(myVote === "dislike"),
                  ),
                };
              }),
            }))
          }

          // 댓글/답글 삭제
          onDelete={(id) =>
            setData((current) => {
              const target = current.comments.find((comment) => comment.id === id);

              const isReply = Boolean(target?.parentCommentId || target?.replyTo);

              return {
                ...current,

                comments: current.comments.filter((comment) => {
                  // 답글이면 해당 답글만 삭제
                  if (isReply) {
                    return comment.id !== id;
                  }

                  // 원댓글이면
                  // 원댓글 + 연결된 답글 삭제
                  return (
                    comment.id !== id && comment.parentCommentId !== id && comment.replyTo !== id
                  );
                }),
              };
            })
          }
        />
      )}
      {settingsOpen && (
        <ReaderSettingsPanel
          settings={settings}
          onChange={updateSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </main>
  );
}
