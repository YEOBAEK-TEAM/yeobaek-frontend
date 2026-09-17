import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { useBookDetail } from "@/hooks/useBookDetail";
import { useContentChapter } from "@/hooks/useContentChapter";
import { useUpdateReadingProgress } from "@/hooks/useUpdateReadingProgress";
import ContentPageReader from "./components/ContentPageReader";
import ReaderPageDeck from "./components/ReaderPageDeck";
import ReaderSettingsPanel from "./components/ReaderSettingsPanel";
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
  const [anchorId, setAnchorId] = useState(pageId);
  const chapter = useContentChapter(anchorId);
  const book = useBookDetail(bookId);
  const { settings, updateSettings, storageError } = useReaderSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { mutate: saveProgress, isError: saveError } = useUpdateReadingProgress(bookId);
  const lastSaved = useRef<{ pageId: number; at: number } | null>(null);
  const pages = [
    ...new Map((chapter.data?.pages ?? []).map((page) => [page.pageId, page])).values(),
  ].sort((a, b) => a.pageNumber - b.pageNumber);
  const index = pages.findIndex((page) => page.pageId === pageId);
  const currentPage = pages[index];
  const wrongBook = pages.some((page) => page.bookId !== bookId);
  const ready = !!currentPage && !wrongBook && !chapter.isError;
  const actualPageId = ready ? currentPage.pageId : undefined;

  // Browser navigation can point outside the currently loaded window.
  if (!chapter.isPending && !chapter.isPlaceholderData && index < 0 && anchorId !== pageId) {
    setAnchorId(pageId);
  }

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

  const navigate = (nextIndex: number) => {
    const next = pages[nextIndex];
    if (!ready || !next || next.pageId === pageId) return;
    window.getSelection()?.removeAllRanges();
    setParams({ bookId: String(bookId), pageId: String(next.pageId) }, { replace: true });
    // Recenter at a known boundary ID, never at an ID inferred from a page number.
    if (nextIndex === 0 || nextIndex === pages.length - 1) setAnchorId(next.pageId);
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
          className="absolute -right-1 flex h-11 w-11 items-center justify-center !text-base !font-semibold"
          onClick={() => setSettingsOpen(true)}
        >
          Aa
        </button>
      </header>
      <div className="book-reader__body">
        {chapter.isPending ? (
          <p role="status" className="book-reader__message">
            책 본문을 불러오는 중입니다.
          </p>
        ) : chapter.isError ? (
          <div role="alert" className="book-reader__message">
            <p>책 본문을 불러오지 못했습니다.</p>
            <button type="button" onClick={() => void chapter.refetch()}>
              다시 시도
            </button>
          </div>
        ) : !ready ? (
          <p role="alert" className="book-reader__message">
            요청한 책의 페이지를 찾을 수 없습니다.
          </p>
        ) : (
          <ReaderPageDeck
            ariaLabel="전자책 본문. 좌우 드래그 또는 방향키로 페이지 이동"
            pages={pages}
            index={index}
            onNavigate={navigate}
            renderPage={(page) => <ContentPageReader key={page.pageId} page={page} />}
          />
        )}
      </div>
      {(saveError || storageError) && (
        <p role="alert" className="book-reader__notice">
          {saveError ? "독서 진행률을 저장하지 못했습니다." : "읽기 설정을 저장하지 못했습니다."}
        </p>
      )}
      <footer className="book-reader__footer">
        <div className="book-reader__progress">
          <input
            type="range"
            aria-label="불러온 페이지 범위에서 이동"
            aria-valuetext={ready ? currentPage.pageNumber + "페이지" : "페이지 준비 중"}
            min={0}
            max={Math.max(0, pages.length - 1)}
            value={Math.max(0, index)}
            disabled={!ready || pages.length <= 1}
            style={{ background: "#f7f6f1" }}
            onChange={(event) => navigate(Number(event.target.value))}
          />
          <span aria-live="polite">{ready ? currentPage.pageNumber + "p" : "—"}</span>
        </div>
        <div className="book-reader__actions">
          <button type="button" aria-label="좋아요 (준비 중)" disabled>
            <Heart size={24} strokeWidth={1.5} />
          </button>
          <button type="button" aria-label="댓글 (준비 중)" disabled>
            <MessageSquare size={24} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="book-reader__bookmark"
            aria-label="북마크 (준비 중)"
            disabled
          >
            <Bookmark size={24} strokeWidth={1.5} />
          </button>
        </div>
      </footer>
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
