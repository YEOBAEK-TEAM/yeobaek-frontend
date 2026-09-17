import type { HighlightColor } from "@/types/sentence";

export const HIGHLIGHT_COLORS: Record<HighlightColor, string> = {
  GREEN: "#c6d8d4",
  BLUE: "#c7cfe7",
  PINK: "#d6cadb",
  YELLOW: "#e9e59c",
  GRAY: "#d1d1d1",
};

export function highlightColorFromCss(css: string): HighlightColor | undefined {
  return (Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).find(
    (color) => HIGHLIGHT_COLORS[color] === css,
  );
}

export function highlightTextParts(text: string, content?: string) {
  const start = content ? text.indexOf(content) : -1;
  if (start < 0 || !content) return { before: text, marked: "", after: "" };
  // The API stores content, not an occurrence offset. Use its first exact match.
  return {
    before: text.slice(0, start),
    marked: content,
    after: text.slice(start + content.length),
  };
}
