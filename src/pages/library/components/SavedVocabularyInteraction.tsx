import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useVocabularyDetail } from "@/hooks/useVocabularyDetail";
import { useDeleteVocabulary } from "@/hooks/useDeleteVocabulary";
import WordMeaningCard from "./WordMeaningCard";

export default function SavedVocabularyInteraction({
  vocabularyId,
  sentenceId,
  anchor,
  onClose,
  onSwipeDisabledChange,
}: {
  vocabularyId: number;
  sentenceId: number;
  anchor: HTMLElement;
  onClose: () => void;
  onSwipeDisabledChange: (disabled: boolean) => void;
}) {
  const detail = useVocabularyDetail(vocabularyId);
  const remove = useDeleteVocabulary();
  const busy = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [meaningOpen, setMeaningOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const repeated = !!detail.data && detail.data.sentenceId !== sentenceId;
  const cardOpen = repeated || meaningOpen;
  const closeRef = useRef(onClose);
  useLayoutEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    onSwipeDisabledChange(true);
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node) && !anchor.contains(event.target as Node))
        closeRef.current();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      onSwipeDisabledChange(false);
    };
  }, [anchor, onSwipeDisabledChange]);

  useLayoutEffect(() => {
    const popup = menu.current;
    const article = anchor.closest("article");
    if (!popup || !article) return;
    const position = () => {
      const rect = anchor.getBoundingClientRect();
      const origin = article.getBoundingClientRect();
      const width = popup.offsetWidth;
      const height = popup.offsetHeight;
      const left = Math.max(
        Math.max(origin.left, 0) + 4,
        Math.min(
          Math.min(origin.right, window.innerWidth) - width - 4,
          rect.left + rect.width / 2 - width / 2,
        ),
      );
      const top = Math.max(
        Math.max(origin.top, 0) + 4,
        Math.min(window.innerHeight - height - 4, rect.top - height - 8),
      );
      popup.style.left = `${left - origin.left + article.scrollLeft}px`;
      popup.style.top = `${top - origin.top + article.scrollTop}px`;
    };
    const observer = new ResizeObserver(position);
    observer.observe(popup);
    observer.observe(article);
    window.addEventListener("resize", position);
    document.addEventListener("scroll", position, true);
    position();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", position);
      document.removeEventListener("scroll", position, true);
    };
  }, [anchor, cardOpen, detail.status]);

  return (
    <div
      ref={root}
      className="book-reader__saved-interaction"
      onPointerDown={(event) => event.stopPropagation()}
    >
      {!cardOpen && (
        <div
          ref={menu}
          className="book-reader__selection book-reader__collected book-reader__saved-menu"
        >
          <div
            className="book-reader__collected-actions"
            role="group"
            aria-label="저장한 단어 관리"
          >
            <button type="button" disabled={!detail.data} onClick={() => setMeaningOpen(true)}>
              뜻 보기
            </button>
            <button
              type="button"
              disabled={remove.isPending}
              onClick={() => {
                if (busy.current) return;
                busy.current = true;
                remove.mutate(vocabularyId, {
                  onSuccess: () => closeRef.current(),
                  onSettled: () => {
                    busy.current = false;
                  },
                });
              }}
            >
              삭제
            </button>
          </div>
        </div>
      )}
      {detail.isPending && <p role="status">저장된 단어를 불러오는 중입니다.</p>}
      {detail.isError && (
        <p role="alert">
          단어를 불러오지 못했습니다.{" "}
          <button type="button" onClick={() => void detail.refetch()}>
            다시 시도
          </button>
        </p>
      )}
      {remove.isError && <p role="alert">삭제하지 못했습니다. 다시 시도해 주세요.</p>}
      {cardOpen && detail.data && (
        <WordMeaningCard
          text={detail.data.word}
          apiEntry={{ ...detail.data, targetCode: "" }}
          saved
          canSave={false}
          saveCompleted={false}
          onSave={() => {}}
          onComplete={onClose}
          compact
          concealMeaning={repeated && !revealed}
          onRevealMeaning={() => setRevealed(true)}
        />
      )}
    </div>
  );
}
