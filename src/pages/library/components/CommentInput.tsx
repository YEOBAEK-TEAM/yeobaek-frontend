import { useEffect, useRef, useState } from "react";

export default function CommentInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    input.current?.focus({ preventScroll: true });
  }, []);
  return (
    <form
      className="book-reader__inline-comment"
      aria-label="선택한 문장에 댓글쓰기"
      onSubmit={(event) => {
        event.preventDefault();
        if (text.trim()) onSubmit(text.trim());
      }}
    >
      <svg className="book-reader__avatar" viewBox="0 0 28 28" role="img" aria-label="기본 프로필">
        <circle cx="14" cy="14" r="14" fill="#dedad0" />
        <circle cx="14" cy="10" r="5" fill="#8c8580" />
        <path d="M4 25c0-6 4-9 10-9s10 3 10 9" fill="#8c8580" />
      </svg>
      <input
        ref={input}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="댓글 추가"
        aria-label="댓글 추가"
        maxLength={2000}
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.nativeEvent.isComposing) event.preventDefault();
        }}
      />
      <button type="submit" disabled={!text.trim()} aria-label="댓글 전송">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 20V4m-6 6 6-6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
