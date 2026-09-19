import { useEffect, useRef, useState } from "react";
import { readerUser } from "../../../mocks/readerUser";

export default function CommentInput({
  onSubmit,
  pending = false,
  error = false,
}: {
  onSubmit: (text: string) => void | boolean | Promise<boolean>;
  pending?: boolean;
  error?: boolean;
}) {
  const [text, setText] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const composing = useRef(false);
  const submitting = useRef(false);
  useEffect(() => {
    input.current?.focus({ preventScroll: true });
  }, []);
  return (
    <>
      <form
        className="book-reader__inline-comment"
        aria-label="선택한 문장에 댓글쓰기"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!text.trim() || composing.current || pending || submitting.current) return;
          submitting.current = true;
          try {
            if ((await onSubmit(text.trim())) !== false) setText("");
          } finally {
            submitting.current = false;
          }
        }}
      >
        {/* Decorative fallback only: the comment API has no profile image field. */}
        <img
          className="h-6 w-6 shrink-0 rounded-full object-cover"
          src={readerUser.profileImage}
          alt=""
        />
        <input
          ref={input}
          value={text}
          readOnly={pending}
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
        <button type="submit" disabled={!text.trim() || pending} aria-label="댓글 전송">
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
      {error && (
        <p role="alert" className="mt-1 text-xs">
          댓글을 저장하지 못했습니다. 다시 시도해 주세요.
        </p>
      )}
    </>
  );
}
