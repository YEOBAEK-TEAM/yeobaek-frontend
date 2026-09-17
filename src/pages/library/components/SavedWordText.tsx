import type { ReactNode } from "react";
import type { SavedWordRange } from "../utils/contentSavedWords";

// Intersect with each highlight piece; only the word's final piece gets a dot.
export default function SavedWordText({
  text,
  offset,
  ranges,
}: {
  text: string;
  offset: number;
  ranges: SavedWordRange[];
}) {
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const range of ranges) {
    const start = Math.max(0, range.start - offset);
    const end = Math.min(text.length, range.end - offset);
    if (start >= end) continue;
    parts.push(text.slice(cursor, start));
    parts.push(
      <span key={range.start} className="book-reader__word" data-saved-word={range.word}>
        {text.slice(start, end)}
        {offset + end === range.end && (
          <span className="book-reader__saved-dot" aria-hidden="true" />
        )}
      </span>,
    );
    cursor = end;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
