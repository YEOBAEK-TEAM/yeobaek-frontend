import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { useBookDetail } from "@/hooks/useBookDetail";
import { contentChapterQueryOptions, useContentChapter } from "@/hooks/useContentChapter";
import { useContentPage } from "@/hooks/useContentPage";
import { useTogglePageLike } from "@/hooks/useTogglePageLike";
import { useTogglePageBookmark } from "@/hooks/useTogglePageBookmark";
import { useUpdateReadingProgress } from "@/hooks/useUpdateReadingProgress";
import ContentPageReader from "./components/ContentPageReader";
import PageCommentsSheet from "./components/PageCommentsSheet";
import ReaderCoverPage from "./components/ReaderCoverPage";
import type { BookDetail } from "@/types/book";
import type { ContentChapterPage } from "@/types/contentPage";
import ReaderPageDeck from "./components/ReaderPageDeck";
import ReaderSettingsPanel from "./components/ReaderSettingsPanel";
import ReportUnlockButton from "@/components/library/viewer/ReportUnlockButton";
import { READER_FONTS, useReaderSettings } from "./utils/useReaderSettings";
import "./BookReadPage.css";

type ReaderPageItem =
  { type: "cover"; book: BookDetail | undefined } | { type: "content"; page: ContentChapterPage };

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
  return (
    <ContentBookReader
      key={bookId}
      bookId={bookId}
      pageId={pageId}
      onCover={params.get("firstRead") === "true"}
    />
  );
}

function ContentBookReader({
  bookId,
  pageId,
  onCover,
}: {
  bookId: number;
  pageId: number;
  onCover: boolean;
}) {
  const [, setParams] = useSearchParams();
  const queryClient = useQueryClient();
  const seekRequest = useRef(0);
  const pageDetail = useContentPage(pageId);
  const [navigation, setNavigation] = useState<{
    urlPageId: number;
    onCover: boolean;
    anchorPageNumber: number;
    targetPageNumber: number;
    seeking: boolean;
  } | null>(null);
  // Ignore local navigation when an external pageId/cover URL is opened.
  const localNavigation =
    navigation?.urlPageId === pageId && navigation.onCover === onCover ? navigation : null;
  const resolvedPage =
    pageDetail.data?.pageId === pageId && pageDetail.data.bookId === bookId
      ? pageDetail.data
      : undefined;
  const targetPageNumber =
    localNavigation?.targetPageNumber ??
    (resolvedPage ? (onCover ? 1 : resolvedPage.pageNumber) : NaN);
  const anchorPageNumber = localNavigation?.anchorPageNumber ?? targetPageNumber;
  const chapter = useContentChapter(bookId, anchorPageNumber);
  const seeking = !!localNavigation?.seeking;
  const [seekPageNumber, setSeekPageNumber] = useState<number | null>(null);
  const seekPreview = useRef<number | null>(null);
  const book = useBookDetail(bookId);
  const { settings, updateSettings, storageError } = useReaderSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commentsPageId, setCommentsPageId] = useState<number | null>(null);
  const { mutate: saveProgress, isError: saveError } = useUpdateReadingProgress(bookId);
  const lastSaved = useRef<{ pageId: number; at: number } | null>(null);
  const pages = [
    ...new Map((chapter.data?.pages ?? []).map((page) => [page.pageId, page])).values(),
  ].sort((a, b) => a.pageNumber - b.pageNumber);
  const index = pages.findIndex((page) => page.pageNumber === targetPageNumber);
  const currentPage = pages[index];
  const wrongBook = pages.some((page) => page.bookId !== bookId);
  const ready = !!currentPage && !wrongBook && !chapter.isError && !seeking;
  const deckPages: ReaderPageItem[] = [
    { type: "cover", book: book.data },
    ...pages.map((page) => ({ type: "content" as const, page })),
  ];
  const deckIndex = onCover ? 0 : index + 1;
  const sliderPageNumber = seekPageNumber ?? (onCover ? 0 : (currentPage?.pageNumber ?? 0));
  const progressPercent =
    chapter.data && chapter.data.allPage > 0 ? (sliderPageNumber / chapter.data.allPage) * 100 : 0;
  const deckPage = deckPages[deckIndex];
  const actualPageId = ready && deckPage?.type === "content" ? deckPage.page.pageId : undefined;
  const deckReady = ready && (!onCover || (!!book.data && !book.isError));
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
    [pageId, onCover],
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

  useEffect(() => {
    if (!actualPageId || settingsOpen) return;
    let timer: number | undefined;
    const schedule = () => {
      window.clearTimeout(timer);
      if (document.visibilityState !== "visible") return;
      timer = window.setTimeout(() => {
        const previous = lastSaved.current;
        if (previous?.pageId === actualPageId && Date.now() - previous.at < 30_000) return;
        const attempt = { pageId: actualPageId, at: Date.now() };
        lastSaved.current = attempt;
        saveProgress(actualPageId, {
          onError: () => {
            if (lastSaved.current === attempt) lastSaved.current = null;
          },
        });
      }, 3000);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [actualPageId, saveProgress, settingsOpen]);

  const showCover = () => {
    setNavigation({
      urlPageId: pageId,
      onCover: true,
      anchorPageNumber: 1,
      targetPageNumber: 1,
      seeking: false,
    });
    setParams(
      { bookId: String(bookId), pageId: String(pageId), firstRead: "true" },
      { replace: true },
    );
  };

  const seekTo = async (target: number) => {
    if (!Number.isSafeInteger(target) || target <= 0) return;
    const request = ++seekRequest.current;
    setNavigation({
      urlPageId: pageId,
      onCover,
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
        onCover: false,
        anchorPageNumber: target,
        targetPageNumber: target,
        seeking: false,
      });
      setParams(
        { bookId: String(bookId), pageId: String(next.pageId), firstRead: "false" },
        { replace: true },
      );
    } catch {
      // The chapter query owns the error UI and retry; keep the original URL for recovery.
    }
  };

  const commitSeek = () => {
    const target = seekPreview.current;
    seekPreview.current = null;
    setSeekPageNumber(null);
    if (
      target === null ||
      !deckReady ||
      !chapter.data ||
      target < 0 ||
      target > chapter.data.allPage
    )
      return;
    if (target === (onCover ? 0 : currentPage.pageNumber)) return;
    window.getSelection()?.removeAllRanges();
    if (target === 0) {
      showCover();
      return;
    }
    void seekTo(target);
  };

  const navigate = (nextIndex: number) => {
    const item = deckPages[nextIndex];
    if (!deckReady || !item) return;
    if (item.type === "cover") {
      if (onCover) return;
      // A temporary window edge is not the beginning of the book.
      if (currentPage.pageNumber > 1) {
        void seekTo(currentPage.pageNumber - 1);
        return;
      }
      showCover();
      return;
    }
    const next = item.page;
    if (!onCover && next.pageId === pageId) return;
    window.getSelection()?.removeAllRanges();
    const contentIndex = nextIndex - 1;
    setNavigation({
      urlPageId: next.pageId,
      onCover: false,
      anchorPageNumber:
        contentIndex === 0 || contentIndex === pages.length - 1
          ? next.pageNumber
          : anchorPageNumber,
      targetPageNumber: next.pageNumber,
      seeking: false,
    });
    setParams(
      { bookId: String(bookId), pageId: String(next.pageId), firstRead: "false" },
      { replace: true },
    );
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
          (seeking && !chapter.isError && !wrongBook && (chapter.isFetching || !!currentPage)) ||
          (onCover && book.isPending) ? (
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
        ) : onCover && book.isError ? (
          <div role="alert" className="book-reader__message">
            <p>표지 정보를 불러오지 못했습니다.</p>
            <button type="button" onClick={() => void book.refetch()}>
              다시 시도
            </button>
            <button
              type="button"
              className="ml-4"
              onClick={() =>
                setParams(
                  { bookId: String(bookId), pageId: String(pageId), firstRead: "false" },
                  { replace: true },
                )
              }
            >
              본문 읽기
            </button>
          </div>
        ) : (
          <ReaderPageDeck
            ariaLabel="전자책 본문. 좌우 드래그 또는 방향키로 페이지 이동"
            pages={deckPages}
            index={deckIndex}
            onNavigate={navigate}
            renderPage={(item, active, onSwipeDisabledChange) =>
              item.type === "cover" ? (
                item.book ? (
                  <ReaderCoverPage
                    title={item.book.title}
                    author={item.book.author}
                    coverUrl={item.book.coverImageUrl}
                  />
                ) : (
                  <p role="status" className="book-reader__message">
                    표지 정보를 준비하고 있습니다.
                  </p>
                )
              ) : (
                <ContentPageReader
                  key={item.page.pageId}
                  page={item.page}
                  active={active}
                  onSwipeDisabledChange={onSwipeDisabledChange}
                />
              )
            }
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
              deckReady
                ? sliderPageNumber === 0
                  ? "표지"
                  : `${sliderPageNumber}/${chapter.data?.allPage}페이지`
                : "페이지 준비 중"
            }
            min={0}
            max={chapter.data?.allPage ?? 0}
            step={1}
            value={sliderPageNumber}
            disabled={!deckReady || !chapter.data?.allPage}
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
            {deckReady && chapter.data
              ? sliderPageNumber === 0
                ? "표지"
                : `${sliderPageNumber}/${chapter.data.allPage}`
              : "—"}
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
            <Heart size={24} strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            aria-label="페이지 댓글"
            disabled={!actualPageId}
            onClick={() => {
              if (actualPageId) setCommentsPageId(actualPageId);
            }}
          >
            <MessageSquare size={24} strokeWidth={1.5} />
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
            <Bookmark size={24} strokeWidth={1.5} fill={bookmarked ? "currentColor" : "none"} />
          </button>
          <ReportUnlockButton bookId={bookId} bookTitle={book.data?.title ?? ""} />
        </div>
      </footer>
      {actualPageId && commentsPageId === actualPageId && (
        <PageCommentsSheet
          key={actualPageId}
          pageId={actualPageId}
          pageNumber={currentPage.pageNumber}
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
