import type { ContentChapterPage } from "@/types/contentPage";

export default function ContentPageReader({ page }: { page: ContentChapterPage }) {
  let imageUrl: string | undefined;
  try {
    const url = new URL(page.imageUrl?.trim() ?? "");
    if (url.protocol === "https:" || url.protocol === "http:") imageUrl = url.href;
  } catch {
    // Empty or invalid image URLs have no image to render.
  }

  return (
    <article
      className="book-reader__text h-full overflow-y-auto overscroll-contain"
      aria-label={`${page.pageNumber}페이지 본문`}
      data-page-id={page.pageId}
    >
      {imageUrl && <img src={imageUrl} alt="" className="h-auto max-w-full" draggable={false} />}
      {[...page.sentences]
        .sort((a, b) => a.sentenceIndex - b.sentenceIndex)
        .map((sentence) => (
          <p
            key={sentence.sentenceId}
            data-sentence-id={sentence.sentenceId}
            className="whitespace-pre-wrap"
          >
            {sentence.content}
          </p>
        ))}
    </article>
  );
}
