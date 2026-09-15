import { useEffect, useRef, useState } from "react";
import { readerUser } from "../../../mocks/readerUser";

export default function CommentInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const composing = useRef(false);
  useEffect(() => {
    input.current?.focus({ preventScroll: true });
  }, []);
  return (
    <form
      className="book-reader__inline-comment"
      aria-label="선택한 문장에 댓글쓰기"
      onSubmit={(event) => {
        event.preventDefault();
        if (!text.trim() || composing.current) return;
        onSubmit(text.trim());
        setText("");
      }}
    >
      <img
        className="h-6 w-6 shrink-0 rounded-full object-cover"
        src={readerUser.profileImage}
        alt={`${readerUser.nickname} 프로필`}
      />
      <input
        ref={input}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="댓글 추가"
        aria-label="댓글 추가"
        maxLength={2000}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={() => {
          composing.current = false;
        }}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            (composing.current ||
              event.nativeEvent.isComposing ||
              event.nativeEvent.keyCode === 229)
          )
            event.preventDefault();
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
