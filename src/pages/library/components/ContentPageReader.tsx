import type { ContentChapterPage } from "@/types/contentPage";
import { Fragment } from "react";
import { useContentTextSelection } from "../utils/useContentTextSelection";
import TextSelectionMenu from "./TextSelectionMenu";
import ContentWordMeaningCard from "./ContentWordMeaningCard";

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
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      data-native-selection={nativeSelection || undefined}
      className="book-reader__text h-full overflow-y-auto overscroll-contain"
      aria-label={`${page.pageNumber}페이지 본문`}
      data-page-id={page.pageId}
    >
      {imageUrl && <img src={imageUrl} alt="" className="h-auto max-w-full" draggable={false} />}
      {[...page.sentences]
        .sort((a, b) => a.sentenceIndex - b.sentenceIndex)
        .map((sentence) => (
          <Fragment key={sentence.sentenceId}>
            <p data-sentence-id={sentence.sentenceId} className="whitespace-pre-wrap">
              {sentence.content}
            </p>
            {active && selection?.sentenceId === sentence.sentenceId && (
              <TextSelectionMenu
                showCloseButton={false}
                menuRef={menuRef}
                mode={wordSelection ? "word" : "default"}
                selectedColor=""
                collectionDisabled
                commentDisabled
                onHighlight={() => {}}
                onComment={() => {}}
                onColor={() => {}}
                onSubmitComment={() => {}}
                onWord={openWord}
                onClose={close}
                wordCard={
                  wordSelection && (
                    <ContentWordMeaningCard
                      key={`${wordSelection.sentenceId}:${wordSelection.text}`}
                      selection={wordSelection}
                      onClose={close}
                    />
                  )
                }
              />
            )}
          </Fragment>
        ))}
    </article>
  );
}
