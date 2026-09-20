import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import heartIcon from "@/assets/icons/reader/heartIcon.png";
import heartFilledIcon from "@/assets/icons/reader/heartFilledIcon.png";
import commentIcon from "@/assets/icons/reader/commentIcon.png";
import bookmarkIcon from "@/assets/icons/reader/bookmarkIcon.png";
import bookmarkFilledIcon from "@/assets/icons/reader/bookmarkFilledIcon.png";
import { useBookDetail } from "@/hooks/useBookDetail";
import { contentChapterQueryOptions, useContentChapter } from "@/hooks/useContentChapter";
import { useContentPage } from "@/hooks/useContentPage";
import { useTogglePageLike } from "@/hooks/useTogglePageLike";
import { useTogglePageBookmark } from "@/hooks/useTogglePageBookmark";
import { useReaderProgressSync } from "./hooks/useReaderProgressSync";
import ContentPageReader from "./components/ContentPageReader";
import PageCommentsSheet from "./components/PageCommentsSheet";
import ReaderPageDeck from "./components/ReaderPageDeck";
import ReaderSettingsPanel from "./components/ReaderSettingsPanel";
import ReportUnlockButton from "@/components/library/viewer/ReportUnlockButton";
import { READER_FONTS, useReaderSettings } from "./utils/useReaderSettings";
import "./BookReadPage.css";

const parseId = (value: string | null) => {
  const id = value && /^\d+$/.test(value) ? Number(value) : NaN;
  return Number.isSafeInteger(id) && id > 0 ? id : NaN;
};

export default function BookReadPage() {
  const [params] = useSearchParams();
  const bookId = parseId(params.get("bookId"));
  const pageId = parseId(params.get("pageId"));
  if (!Number.isSafeInteger(bookId) || !Number.isSafeInteger(pageId)) {
    return (
      <main className="book-reader">
        <header className="book-reader__header">
          <Link to="/library">서재로 돌아가기</Link>
        </header>
        <p role="alert" className="book-reader__message">
          책 정보를 불러올 수 없습니다.
        </p>
      </main>
    );
  }
  return <ContentBookReader key={bookId} bookId={bookId} pageId={pageId} />;
}

function ContentBookReader({ bookId, pageId }: { bookId: number; pageId: number }) {
  const [, setParams] = useSearchParams();
  const queryClient = useQueryClient();
  const seekRequest = useRef(0);
  const pageDetail = useContentPage(pageId);
  const [navigation, setNavigation] = useState<{
    urlPageId: number;
    anchorPageNumber: number;
    targetPageNumber: number;
    seeking: boolean;
  } | null>(null);
  // Ignore local navigation when an external pageId URL is opened.
  const localNavigation = navigation?.urlPageId === pageId ? navigation : null;
  const resolvedPage =
    pageDetail.data?.pageId === pageId && pageDetail.data.bookId === bookId
      ? pageDetail.data
      : undefined;
  const targetPageNumber = localNavigation?.targetPageNumber ?? resolvedPage?.pageNumber ?? NaN;
  const anchorPageNumber = localNavigation?.anchorPageNumber ?? targetPageNumber;
  const chapter = useContentChapter(bookId, anchorPageNumber);
  const seeking = !!localNavigation?.seeking;
  const [seekPageNumber, setSeekPageNumber] = useState<number | null>(null);
  const seekPreview = useRef<number | null>(null);
  const book = useBookDetail(bookId);
  const { settings, updateSettings, storageError } = useReaderSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commentsPageId, setCommentsPageId] = useState<number | null>(null);
  const pages = [
    ...new Map((chapter.data?.pages ?? []).map((page) => [page.pageId, page])).values(),
  ].sort((a, b) => a.pageNumber - b.pageNumber);
  const index = pages.findIndex((page) => page.pageNumber === targetPageNumber);
  const currentPage = pages[index];
  const wrongBook = pages.some((page) => page.bookId !== bookId);
  const ready = !!currentPage && !wrongBook && !chapter.isError && !seeking;
  const sliderPageNumber = seekPageNumber ?? currentPage?.pageNumber ?? 1;
  const progressPercent =
    chapter.data && chapter.data.allPage > 0 ? (sliderPageNumber / chapter.data.allPage) * 100 : 0;
  const actualPageId = ready ? currentPage.pageId : undefined;
  const { isError: saveError } = useReaderProgressSync({
    bookId,
    pageId: actualPageId,
    settingsOpen,
  });
  const likeMutation = useTogglePageLike();
  const bookmarkMutation = useTogglePageBookmark();
  const actionsReady =
    !!actualPageId && pageDetail.isSuccess && pageDetail.data.pageId === actualPageId;
  const liked = actionsReady && pageDetail.data.liked;
  const bookmarked = actionsReady && pageDetail.data.bookmarked;
  const likeError = likeMutation.isError && likeMutation.variables?.pageId === actualPageId;
  const bookmarkError =
    bookmarkMutation.isError && bookmarkMutation.variables?.pageId === actualPageId;

  useEffect(
    () => () => {
      seekRequest.current += 1;
    },
    [pageId],
  );

  useEffect(() => {
    const elements = [document.documentElement, document.body];
    const previous = elements.map((element) => element.style.overflow);
    elements.forEach((element) => {
      element.style.overflow = "hidden";
    });
    return () =>
      elements.forEach((element, i) => {
        element.style.overflow = previous[i];
      });
  }, []);

  const seekTo = async (target: number) => {
    if (!Number.isSafeInteger(target) || target <= 0) return;
    const request = ++seekRequest.current;
    setNavigation({
      urlPageId: pageId,
      anchorPageNumber: target,
      targetPageNumber: target,
      seeking: true,
    });
    try {
      // Shares the hook's key and in-flight request; placeholder data is never returned here.
      const result = await queryClient.fetchQuery(contentChapterQueryOptions(bookId, target));
      if (request !== seekRequest.current) return;
      const next = result.pages.find(
        (page) => page.pageNumber === target && page.bookId === bookId,
      );
      if (!next) return;
      setNavigation({
        urlPageId: next.pageId,
        anchorPageNumber: target,
        targetPageNumber: target,
        seeking: false,
      });
      setParams({ bookId: String(bookId), pageId: String(next.pageId) }, { replace: true });
    } catch {
      // The chapter query owns the error UI and retry; keep the original URL for recovery.
    }
  };

  const commitSeek = () => {
    const target = seekPreview.current;
    seekPreview.current = null;
    setSeekPageNumber(null);
    if (target === null || !ready || !chapter.data || target < 1 || target > chapter.data.allPage)
      return;
    if (target === currentPage.pageNumber) return;
    window.getSelection()?.removeAllRanges();
    void seekTo(target);
  };

  const navigate = (nextIndex: number) => {
    if (!ready || !chapter.data) return;
    // The chapter window edge is not necessarily the book boundary.
    if (nextIndex === -1 || nextIndex === pages.length) {
      const target = currentPage.pageNumber + (nextIndex === -1 ? -1 : 1);
      if (target >= 1 && target <= chapter.data.allPage) {
        window.getSelection()?.removeAllRanges();
        void seekTo(target);
      }
      return;
    }
    const next = pages[nextIndex];
    if (!next || next.pageId === pageId) return;
    window.getSelection()?.removeAllRanges();
    setNavigation({
      urlPageId: next.pageId,
      anchorPageNumber:
        nextIndex === 0 || nextIndex === pages.length - 1 ? next.pageNumber : anchorPageNumber,
      targetPageNumber: next.pageNumber,
      seeking: false,
    });
    setParams({ bookId: String(bookId), pageId: String(next.pageId) }, { replace: true });
  };

  return (
    <main
      className="book-reader"
      style={
        {
          "--reader-font-size": settings.fontSize + "px",
          "--reader-line-height": settings.lineHeight,
          "--reader-font-family": READER_FONTS[settings.fontFamily],
          "--reader-background": settings.backgroundColor,
          "--reader-foreground": settings.backgroundColor === "#000000" ? "#e7e5dd" : "#595854",
        } as CSSProperties
      }
    >
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
        <h1>{book.data?.title ?? "책 읽기"}</h1>
        <button
          type="button"
          aria-label="읽기 설정"
          aria-haspopup="dialog"
          aria-expanded={settingsOpen}
          className="absolute -right-1 flex h-11 w-11 items-center justify-center text-base! font-semibold!"
          onClick={() => setSettingsOpen(true)}
        >
          Aa
        </button>
      </header>
      <div className="book-reader__body">
        {!localNavigation && pageDetail.isError ? (
          <div role="alert" className="book-reader__message">
            <p>진입 페이지 정보를 불러오지 못했습니다.</p>
            <button type="button" onClick={() => void pageDetail.refetch()}>
              다시 시도
            </button>
          </div>
        ) : !localNavigation && pageDetail.isSuccess && !resolvedPage ? (
          <p role="alert" className="book-reader__message">
            요청한 책의 페이지를 찾을 수 없습니다.
          </p>
        ) : chapter.isPending ||
          (!currentPage && chapter.isFetching) ||
          (seeking && !chapter.isError && !wrongBook && (chapter.isFetching || !!currentPage)) ? (
          <p role="status" className="book-reader__message">
            책 본문을 불러오는 중입니다.
          </p>
        ) : chapter.isError ? (
          <div role="alert" className="book-reader__message">
            <p>책 본문을 불러오지 못했습니다.</p>
            <button
              type="button"
              onClick={() => {
                if (seeking) void seekTo(targetPageNumber);
                else void chapter.refetch();
              }}
            >
              다시 시도
            </button>
            {seeking && (
              <button type="button" className="ml-4" onClick={() => setNavigation(null)}>
                이전 페이지로 돌아가기
              </button>
            )}
          </div>
        ) : !ready ? (
          <p role="alert" className="book-reader__message">
            요청한 책의 페이지를 찾을 수 없습니다.
            {seeking && (
              <button type="button" className="ml-4" onClick={() => setNavigation(null)}>
                이전 페이지로 돌아가기
              </button>
            )}
          </p>
        ) : (
          <ReaderPageDeck
            ariaLabel="전자책 본문. 좌우 드래그 또는 방향키로 페이지 이동"
            pages={pages}
            index={index}
            hasPrevious={currentPage.pageNumber > 1}
            hasNext={currentPage.pageNumber < (chapter.data?.allPage ?? 0)}
            onNavigate={navigate}
            renderPage={(page, active, onSwipeDisabledChange) => (
              <ContentPageReader
                key={page.pageId}
                page={page}
                active={active}
                onSwipeDisabledChange={onSwipeDisabledChange}
              />
            )}
          />
        )}
      </div>
      {(saveError || storageError) && (
        <p role="alert" className="book-reader__notice">
          {saveError ? "독서 진행률을 저장하지 못했습니다." : "읽기 설정을 저장하지 못했습니다."}
        </p>
      )}
      <footer className="book-reader__footer">
        {actualPageId && (pageDetail.isError || likeError || bookmarkError) && (
          <p role="alert" className="book-reader__notice">
            {pageDetail.isError
              ? "좋아요와 북마크 상태를 불러오지 못했습니다."
              : likeError
                ? "좋아요를 변경하지 못했습니다. 다시 시도해 주세요."
                : "북마크를 변경하지 못했습니다. 다시 시도해 주세요."}
            {pageDetail.isError && (
              <button type="button" onClick={() => void pageDetail.refetch()}>
                다시 시도
              </button>
            )}
          </p>
        )}
        <div className="book-reader__progress">
          <input
            type="range"
            className="book-reader__progress-bar"
            aria-label="책 전체 페이지 이동"
            aria-valuetext={
              ready ? `${sliderPageNumber}/${chapter.data?.allPage}페이지` : "페이지 준비 중"
            }
            min={1}
            max={Math.max(1, chapter.data?.allPage ?? 1)}
            step={1}
            value={sliderPageNumber}
            disabled={!ready || !chapter.data?.allPage}
            onChange={(event) => {
              seekPreview.current = Number(event.currentTarget.value);
              setSeekPageNumber(seekPreview.current);
            }}
            onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
            onPointerUp={commitSeek}
            onPointerCancel={() => {
              seekPreview.current = null;
              setSeekPageNumber(null);
            }}
            onKeyUp={(event) => {
              if (
                [
                  "ArrowLeft",
                  "ArrowRight",
                  "ArrowUp",
                  "ArrowDown",
                  "Home",
                  "End",
                  "PageUp",
                  "PageDown",
                  "Enter",
                ].includes(event.key)
              )
                commitSeek();
            }}
            onBlur={commitSeek}
            style={
              {
                background: `linear-gradient(to right, #B7BD9E 0%, #B7BD9E ${progressPercent}%, #F7F6F1 ${progressPercent}%, #F7F6F1 100%)`,
              } as CSSProperties
            }
          />
          <span aria-live="polite">
            {ready && chapter.data ? `${sliderPageNumber}/${chapter.data.allPage}` : "—"}
          </span>
        </div>
        <div className="book-reader__actions">
          <button
            type="button"
            aria-label="좋아요"
            aria-pressed={liked}
            disabled={!actionsReady || likeMutation.isPending}
            onClick={() => {
              if (!actionsReady || likeMutation.isPending) return;
              likeMutation.mutate({ pageId: actualPageId, liked });
            }}
          >
            <img
              src={liked ? heartFilledIcon : heartIcon}
              alt=""
              aria-hidden="true"
              className="h-6 w-6 object-contain"
            />
            <span>{actionsReady ? pageDetail.data.likeCount.toLocaleString("ko-KR") : "—"}</span>
          </button>
          <button
            type="button"
            aria-label="페이지 댓글"
            disabled={!actionsReady}
            onClick={() => {
              if (actionsReady) setCommentsPageId(actualPageId);
            }}
          >
            <img src={commentIcon} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
            <span>{actionsReady ? pageDetail.data.commentCount.toLocaleString("ko-KR") : "—"}</span>
          </button>
          <button
            type="button"
            className="book-reader__bookmark"
            aria-label="북마크"
            aria-pressed={bookmarked}
            disabled={!actionsReady || bookmarkMutation.isPending}
            onClick={() => {
              if (!actionsReady || bookmarkMutation.isPending) return;
              bookmarkMutation.mutate({ pageId: actualPageId, bookmarked });
            }}
          >
            <img
              src={bookmarked ? bookmarkFilledIcon : bookmarkIcon}
              alt=""
              aria-hidden="true"
              className="h-6 w-6 object-contain"
            />
          </button>
          <ReportUnlockButton bookId={bookId} bookTitle={book.data?.title ?? ""} />
        </div>
      </footer>
      {actionsReady && commentsPageId === actualPageId && (
        <PageCommentsSheet
          key={actualPageId}
          pageId={actualPageId}
          pageNumber={currentPage.pageNumber}
          commentCount={pageDetail.data.commentCount}
          sentences={currentPage.sentences}
          onClose={() => setCommentsPageId(null)}
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
