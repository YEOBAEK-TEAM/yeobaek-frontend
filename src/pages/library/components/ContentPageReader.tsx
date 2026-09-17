import type { ContentChapterPage } from "@/types/contentPage";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSentenceList } from "@/hooks/useSentenceList";
import { useHighlightMutation } from "@/hooks/useHighlightMutation";
import type { ContentTextSelection } from "../utils/contentTextSelection";
import {
  HIGHLIGHT_COLORS,
  highlightColorFromCss,
  highlightTextParts,
} from "../utils/contentHighlights";
import { useContentTextSelection } from "../utils/useContentTextSelection";
import TextSelectionMenu from "./TextSelectionMenu";
import ContentWordMeaningCard from "./ContentWordMeaningCard";
import CollectedSentenceMenu from "./CollectedSentenceMenu";
import { useSavedVocabularyWords } from "@/hooks/useSavedVocabularyWords";
import { normalizeSavedWord, savedWordRanges } from "../utils/contentSavedWords";
import SavedWordText from "./SavedWordText";
import SavedVocabularyInteraction from "./SavedVocabularyInteraction";

export default function ContentPageReader({
  page,
  active,
  onSwipeDisabledChange,
}: {
  page: ContentChapterPage;
  active: boolean;
  onSwipeDisabledChange: (disabled: boolean) => void;
}) {
  const {
    articleRef,
    menuRef,
    selection,
    wordSelection,
    close,
    openWord,
    onPointerDown,
    onPointerMove,
    nativeSelection,
  } = useContentTextSelection(active, onSwipeDisabledChange);
  const highlights = useSentenceList(active, page.bookId);
  const vocabulary = useSavedVocabularyWords(active);
  const lookupSelection = wordSelection;
  const [savedWord, setSavedWord] = useState<{
    vocabularyId: number;
    sentenceId: number;
    anchor: HTMLElement;
  } | null>(null);
  const wordPress = useRef<{ x: number; y: number } | null>(null);
  const mutation = useHighlightMutation();
  const pending = useRef(false);
  const savedMenuRef = useRef<HTMLDivElement>(null);
  const savedInlineMenuRef = useRef<HTMLDivElement>(null);
  const savedClick = useRef<number | undefined>(undefined);
  const [collecting, setCollecting] = useState<ContentTextSelection | null>(null);
  const [savedMenu, setSavedMenu] = useState<{
    sentenceId: number;
    activeMode: "color" | "note" | null;
    wordOpen?: boolean;
  } | null>(null);
  const savedHighlight = highlights.data?.find((item) => item.sentenceId === savedMenu?.sentenceId);
  const collectingNow = !!selection && collecting === selection;

  useEffect(() => () => window.clearTimeout(savedClick.current), []);
  useEffect(() => {
    if (!active || !savedMenu) return;
    onSwipeDisabledChange(true);
    const outside = (event: PointerEvent) => {
      if (
        !savedMenuRef.current?.contains(event.target as Node) &&
        !savedInlineMenuRef.current?.contains(event.target as Node)
      )
        setSavedMenu(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSavedMenu(null);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      onSwipeDisabledChange(false);
    };
  }, [active, savedMenu, onSwipeDisabledChange]);

  const run = (action: Parameters<typeof mutation.mutate>[0]) => {
    if (pending.current) return;
    pending.current = true;
    mutation.mutate(action, {
      onSuccess: () => {
        close();
        setCollecting(null);
        setSavedMenu(null);
      },
      onSettled: () => {
        pending.current = false;
      },
    });
  };
  let imageUrl: string | undefined;
  try {
    const url = new URL(page.imageUrl?.trim() ?? "");
    if (url.protocol === "https:" || url.protocol === "http:") imageUrl = url.href;
  } catch {
    // Empty or invalid image URLs have no image to render.
  }

  return (
    <article
      ref={articleRef}
      onPointerDown={(event) => {
        if (!nativeSelection && (event.target as Element).closest("[data-saved-word]")) {
          wordPress.current = { x: event.clientX, y: event.clientY };
          return;
        }
        wordPress.current = null;
        onPointerDown(event);
      }}
      onClickCapture={(event) => {
        const anchor = (event.target as Element).closest<HTMLElement>("[data-saved-word]");
        if (!active || nativeSelection || !anchor) return;
        event.stopPropagation();
        const press = wordPress.current;
        if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 5) return;
        const sentence = anchor.closest<HTMLElement>("[data-sentence-id]");
        const item = vocabulary.items.find(
          (item) => normalizeSavedWord(item.word) === anchor.dataset.savedWord,
        );
        if (!sentence || !item) return;
        if (savedWord?.anchor === anchor) return;
        close();
        setSavedMenu(null);
        setSavedWord({
          vocabularyId: item.vocabularyId,
          sentenceId: Number(sentence.dataset.sentenceId),
          anchor,
        });
      }}
      onPointerMove={onPointerMove}
      data-native-selection={nativeSelection || undefined}
      className="book-reader__text relative h-full overflow-y-auto overscroll-contain"
      aria-label={`${page.pageNumber}페이지 본문`}
      data-page-id={page.pageId}
    >
      {imageUrl && <img src={imageUrl} alt="" className="h-auto max-w-full" draggable={false} />}
      {[...page.sentences]
        .sort((a, b) => a.sentenceIndex - b.sentenceIndex)
        .map((sentence) => {
          const highlight = highlights.data?.find(
            (item) => item.sentenceId === sentence.sentenceId,
          );
          const parts = highlightTextParts(sentence.content, highlight?.content);
          const wordRanges = savedWordRanges(sentence.content, vocabulary.words);
          return (
            <Fragment key={sentence.sentenceId}>
              <p data-sentence-id={sentence.sentenceId} className="whitespace-pre-wrap">
                <SavedWordText text={parts.before} offset={0} ranges={wordRanges} />
                {highlight && parts.marked && (
                  <mark
                    data-highlight-id={highlight.sentenceId}
                    style={{ backgroundColor: HIGHLIGHT_COLORS[highlight.color] }}
                    role="button"
                    tabIndex={active ? 0 : -1}
                    aria-label="수집한 문장 관리"
                    onClick={(event) => {
                      if (event.detail > 1 || savedClick.current !== undefined) {
                        window.clearTimeout(savedClick.current);
                        savedClick.current = undefined;
                        return;
                      }
                      if (!active || nativeSelection) return;
                      // Let double-click word selection win over the saved-menu action.
                      savedClick.current = window.setTimeout(() => {
                        savedClick.current = undefined;
                        close();
                        mutation.reset();
                        setSavedMenu({ sentenceId: highlight.sentenceId, activeMode: null });
                      }, 350);
                    }}
                    onKeyDown={(event) => {
                      if (active && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        close();
                        mutation.reset();
                        setSavedMenu({ sentenceId: highlight.sentenceId, activeMode: null });
                      }
                    }}
                  >
                    <SavedWordText
                      text={parts.marked}
                      offset={parts.before.length}
                      ranges={wordRanges}
                    />
                  </mark>
                )}
                <SavedWordText
                  text={parts.after}
                  offset={parts.before.length + parts.marked.length}
                  ranges={wordRanges}
                />
              </p>
              {active && selection?.sentenceId === sentence.sentenceId && (
                <TextSelectionMenu
                  showCloseButton={false}
                  menuRef={menuRef}
                  mode={collectingNow ? "highlight" : lookupSelection ? "word" : "default"}
                  selectedColor={highlight ? HIGHLIGHT_COLORS[highlight.color] : ""}
                  collectionDisabled={mutation.isPending}
                  colorDisabled={mutation.isPending}
                  commentDisabled
                  onHighlight={() => {
                    mutation.reset();
                    setCollecting(selection);
                  }}
                  onComment={() => {}}
                  onColor={(css) => {
                    const color = highlightColorFromCss(css);
                    if (color)
                      run({
                        type: "create",
                        sentenceId: selection.sentenceId,
                        content: selection.text,
                        color,
                      });
                  }}
                  onSubmitComment={() => {}}
                  onWord={() => {
                    setCollecting(null);
                    openWord();
                  }}
                  onClose={close}
                  wordCard={
                    lookupSelection && (
                      <ContentWordMeaningCard
                        key={`${lookupSelection.sentenceId}:${lookupSelection.text}`}
                        selection={lookupSelection}
                        savedWords={vocabulary.words}
                        savedWordsReady={vocabulary.ready}
                        onClose={close}
                      />
                    )
                  }
                />
              )}
              {active &&
                savedMenu?.sentenceId === sentence.sentenceId &&
                savedMenu.activeMode &&
                savedHighlight && (
                  <TextSelectionMenu
                    menuRef={savedInlineMenuRef}
                    showCloseButton={false}
                    mode={
                      savedMenu.activeMode === "color"
                        ? "highlight"
                        : savedMenu.wordOpen
                          ? "word"
                          : "default"
                    }
                    selectedColor={HIGHLIGHT_COLORS[savedHighlight.color]}
                    collectionDisabled={mutation.isPending}
                    colorDisabled={mutation.isPending}
                    commentDisabled
                    onHighlight={() => setSavedMenu({ ...savedMenu, activeMode: "color" })}
                    onWord={() =>
                      setSavedMenu({ ...savedMenu, activeMode: "note", wordOpen: true })
                    }
                    onComment={() => {}}
                    onColor={(css) => {
                      const color = highlightColorFromCss(css);
                      if (color)
                        run({ type: "color", sentenceId: savedHighlight.sentenceId, color });
                    }}
                    onSubmitComment={() => {}}
                    onClose={() => setSavedMenu(null)}
                    wordCard={
                      savedMenu.wordOpen && (
                        <ContentWordMeaningCard
                          key={`${savedHighlight.sentenceId}:${savedHighlight.content}`}
                          selection={{
                            sentenceId: savedHighlight.sentenceId,
                            text: savedHighlight.content,
                          }}
                          savedWords={vocabulary.words}
                          savedWordsReady={vocabulary.ready}
                          onClose={() => setSavedMenu(null)}
                        />
                      )
                    }
                  />
                )}
              {active && savedWord?.sentenceId === sentence.sentenceId && (
                <SavedVocabularyInteraction
                  key={savedWord.vocabularyId + ":" + savedWord.sentenceId}
                  vocabularyId={savedWord.vocabularyId}
                  sentenceId={savedWord.sentenceId}
                  anchor={savedWord.anchor}
                  onClose={() => setSavedWord(null)}
                  onSwipeDisabledChange={onSwipeDisabledChange}
                />
              )}
            </Fragment>
          );
        })}
      {active && highlights.isError && (
        <p role="alert" className="book-reader__word-hint">
          하이라이트를 불러오지 못했습니다.
          <button type="button" onClick={() => void highlights.refetch()}>
            다시 시도
          </button>
        </p>
      )}
      {active && vocabulary.isError && (
        <p role="alert" className="book-reader__word-hint">
          저장된 단어를 확인하지 못했습니다.
          <button type="button" onClick={() => void vocabulary.retry()}>
            다시 시도
          </button>
        </p>
      )}
      {active && mutation.isError && (
        <p role="alert" className="book-reader__word-hint">
          하이라이트를 변경하지 못했습니다. 다시 시도해 주세요.
        </p>
      )}
      {active && savedMenu && savedHighlight && (
        <CollectedSentenceMenu
          menuRef={savedMenuRef}
          left={0}
          top={0}
          highlightId={String(savedHighlight.sentenceId)}
          activeMode={savedMenu.activeMode}
          disabled={mutation.isPending}
          onNote={() => setSavedMenu({ ...savedMenu, activeMode: "note", wordOpen: false })}
          onChangeColor={() => setSavedMenu({ ...savedMenu, activeMode: "color" })}
          onDelete={() => run({ type: "delete", sentenceId: savedHighlight.sentenceId })}
        />
      )}
    </article>
  );
}
