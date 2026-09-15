import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReaderComment } from "../utils/useReaderData";
import { readerUser } from "../../../mocks/readerUser";
import CommentConfirmModal from "./CommentConfirmModal";

type Props = {
  comments: ReaderComment[];
  replies: ReaderComment[];
  pageNumber: number;
  onClose: () => void;
  onSubmit: (text: string, replyTo?: string) => void;
  onVote: (id: string, vote: "like" | "dislike") => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onReport: (id: string) => void;
  reportedCommentIds: string[];
};
const dateLabel = (value?: string) => {
  if (!value || Number.isNaN(Date.parse(value))) return "";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function ReaderCommentsSheet({
  comments,
  replies,
  pageNumber,
  onClose,
  onSubmit,
  onVote,
  onDelete,
  onEdit,
  onReport,
  reportedCommentIds,
}: Props) {
  const [tab, setTab] = useState("popular");
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<string>();
  const listRef = useRef<HTMLDivElement>(null);
  const commentScroll = useRef(0);
  const scrollToNewReply = useRef(false);
  const [menu, setMenu] = useState<string>();
  const [editingId, setEditingId] = useState<string>();
  const [editText, setEditText] = useState("");
  const [confirmation, setConfirmation] = useState<{ id: string; action: "delete" | "report" }>();
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!menu) return;
    const outside = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-comment-menu]")) setMenu(undefined);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [menu]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const composing = useRef(false);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previous?.focus();
  }, []);
  const parent = comments.find((comment) => comment.id === replyTo);
  const parentId = parent?.id;
  const threadReplies = replies.filter(
    (reply) => (reply.parentCommentId ?? reply.replyTo) === parent?.id,
  );
  const back = () => {
    if (!replyTo) {
      onClose();
      return;
    }
    setReplyTo(undefined);
    setDraft("");
    setMenu(undefined);
    setEditingId(undefined);
  };
  useLayoutEffect(() => {
    if (listRef.current) listRef.current.scrollTop = parentId ? 0 : commentScroll.current;
  }, [parentId]);
  useLayoutEffect(() => {
    if (!scrollToNewReply.current || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
    scrollToNewReply.current = false;
  }, [threadReplies.length]);
  const shown = parent
    ? [parent]
    : comments
        .filter((comment) => tab !== "fan" || comment.user?.isFan)
        .sort((a, b) => {
          if (tab === "popular" && (a.likes ?? 0) !== (b.likes ?? 0))
            return (b.likes ?? 0) - (a.likes ?? 0);
          return (Date.parse(b.createdAt ?? "") || 0) - (Date.parse(a.createdAt ?? "") || 0);
        });
  return (
    <div className="book-reader__sheet-backdrop !bg-transparent" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reader-comments-title"
        aria-description={`${pageNumber}페이지 댓글`}
        className="flex h-[82dvh] max-h-[calc(100dvh-24px)] w-full max-w-[390px] flex-col overflow-hidden rounded-t-[20px] bg-[#b8be9f] text-[#141610] shadow-[0_-4px_20px_#00000008] [font-family:system-ui,sans-serif]"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            if (menu) {
              setMenu(undefined);
              return;
            }
            if (editingId) {
              setEditingId(undefined);
              return;
            }
            back();
          }
          if (event.key !== "Tab") return;
          const controls = [
            ...event.currentTarget.querySelectorAll<HTMLElement>(
              "button:not(:disabled), input:not(:disabled), textarea:not(:disabled)",
            ),
          ];
          const first = controls[0],
            last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <header className="flex shrink-0 items-center justify-between px-7 pt-4 pb-3">
          <h2 id="reader-comments-title" className="text-xl font-semibold">
            {parent ? `답글 (${threadReplies.length})` : `댓글 (${comments.length})`}
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label={parent ? "댓글 목록으로 돌아가기" : "댓글 닫기"}
            className="flex h-11 w-11 items-center justify-center"
            onClick={back}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m5 5 14 14M19 5 5 19" />
            </svg>
          </button>
        </header>
        <div
          className="grid shrink-0 grid-cols-3 border-b-4 border-[#d8ddc5] px-4"
          aria-label="댓글 정렬"
        >
          {[
            ["popular", "인기 댓글"],
            ["latest", "최신 댓글"],
            ["fan", "찐팬 댓글"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={tab === key}
              className={`relative min-h-12 text-sm ${tab === key ? "font-bold after:absolute after:-bottom-1 after:left-[12%] after:h-1 after:w-3/4 after:bg-[#4b5239]" : "font-normal"}`}
              onClick={() => {
                setTab(key);
                setMenu(undefined);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          ref={listRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          aria-live="polite"
        >
          {shown.length === 0 && (
            <p className="px-7 py-10 text-center text-sm text-[#72795e]">
              {tab === "fan" ? "아직 찐팬 댓글이 없습니다." : "이 페이지에 첫 의견을 남겨보세요."}
            </p>
          )}
          {shown.map((comment) => (
            <article
              key={comment.id}
              className="relative border-b-[3px] border-[#aab38a] px-6 pt-4 pb-5"
            >
              <div className="flex gap-4">
                <div className="flex w-12 shrink-0 flex-col items-center gap-3">
                  <img
                    src={comment.user?.profileImage || readerUser.profileImage}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  {(comment.likes ?? 0) >= 10 && (
                    <span className="rounded-full border border-white px-2 text-sm text-white">
                      BEST
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="pr-6 text-sm">{comment.user?.nickname ?? "독자"}</div>
                  {comment.createdAt && (
                    <time dateTime={comment.createdAt} className="text-sm text-[#747b60]">
                      {dateLabel(comment.createdAt)}
                    </time>
                  )}
                  {comment.replyTo && (
                    <p className="mt-1 text-xs text-[#747b60]">
                      ↳{" "}
                      {comments.find((parent) => parent.id === comment.replyTo)?.user?.nickname ??
                        "독자"}
                      님에게 답글
                    </p>
                  )}
                  {comment.quote && (
                    <p title={comment.quote} className="mt-2 truncate text-sm text-[#747b60]">
                      {comment.quote}
                    </p>
                  )}
                  {editingId === comment.id ? (
                    <form
                      className="mt-2"
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (!editText.trim() || editText.length > 200) return;
                        onEdit(comment.id, editText);
                        setEditingId(undefined);
                        setNotice("댓글이 수정되었습니다.");
                      }}
                    >
                      <div className="bg-[#ccd0b6] px-2 pt-2 pb-1">
                        <textarea
                          autoFocus
                          aria-label="댓글 수정"
                          className="min-h-16 w-full resize-y bg-transparent text-sm leading-5 outline-none"
                          maxLength={200}
                          value={editText}
                          onChange={(event) => setEditText(event.target.value)}
                        />
                        <div className="text-right text-[10px] text-[#747b60]" aria-live="polite">
                          {editText.length}/200
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="submit"
                          disabled={!editText.trim() || editText.length > 200}
                          className="min-h-7 rounded border border-[#626b4e]"
                        >
                          수정완료
                        </button>
                        <button
                          type="button"
                          className="min-h-7 rounded bg-[#493d3c] text-white"
                          onClick={() => setEditingId(undefined)}
                        >
                          취소하기
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p
                      className={`${comment.quote ? "" : "mt-2"} whitespace-pre-wrap break-words text-sm leading-5`}
                    >
                      {comment.text}
                    </p>
                  )}
                </div>
              </div>
              <div className="absolute top-3 right-3" data-comment-menu>
                <button
                  type="button"
                  aria-label="댓글 더보기"
                  aria-expanded={menu === comment.id}
                  className="h-8 w-6 text-xl text-[#4b5239]"
                  onClick={() => setMenu(menu === comment.id ? undefined : comment.id)}
                >
                  ⋮
                </button>
                {menu === comment.id && (
                  <div
                    className="absolute top-8 right-0 z-10 w-24 overflow-hidden rounded-xl bg-[#f7f6f1] py-2 text-xs shadow-lg"
                    aria-label="댓글 관리"
                  >
                    <button
                      type="button"
                      className="min-h-9 w-full px-3 hover:bg-black/5"
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditText(comment.text);
                        setMenu(undefined);
                      }}
                    >
                      수정하기
                    </button>
                    <button
                      type="button"
                      className="min-h-9 w-full px-3 hover:bg-black/5"
                      onClick={() => {
                        setConfirmation({ id: comment.id, action: "delete" });
                        setMenu(undefined);
                      }}
                    >
                      삭제하기
                    </button>
                    <button
                      type="button"
                      disabled={reportedCommentIds.includes(comment.id)}
                      className="min-h-9 w-full px-3 hover:bg-black/5"
                      onClick={() => {
                        setConfirmation({ id: comment.id, action: "report" });
                        setMenu(undefined);
                      }}
                    >
                      {reportedCommentIds.includes(comment.id) ? "신고 완료" : "신고하기"}
                    </button>
                  </div>
                )}
              </div>
              {editingId !== comment.id && (
                <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#8b956d]">
                  <button
                    type="button"
                    className="rounded border border-[#8b956d] px-3 py-1"
                    onClick={() => {
                      if (parent) {
                        inputRef.current?.focus();
                        return;
                      }
                      commentScroll.current = listRef.current?.scrollTop ?? 0;
                      setReplyTo(comment.id);
                      setDraft("");
                      setMenu(undefined);
                      setEditingId(undefined);
                      closeRef.current?.focus();
                    }}
                  >
                    답글
                  </button>
                  <div className="flex gap-2">
                    {(["like", "dislike"] as const).map((vote) => (
                      <button
                        type="button"
                        key={vote}
                        aria-label={vote === "like" ? "좋아요" : "싫어요"}
                        aria-pressed={comment.myVote === vote}
                        className={`flex items-center gap-1 rounded border border-[#8b956d] px-1.5 py-1 ${comment.myVote === vote ? "bg-[#8b956d] text-white" : ""}`}
                        onClick={() => onVote(comment.id, vote)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={vote === "dislike" ? "rotate-180" : undefined}
                          aria-hidden="true"
                        >
                          <path d="M2 10h4v12H2zm6 0 5-8c3 0 3 3 2 6h5c2 0 2 2 2 3l-2 9c0 1-1 2-3 2H8z" />
                        </svg>
                        <span className="text-white">
                          {(vote === "like" ? comment.likes : comment.dislikes) ?? 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
          {parent && threadReplies.length === 0 && (
            <p className="px-7 py-8 text-center text-sm text-[#72795e]">첫 답글을 남겨보세요.</p>
          )}
          {parent &&
            threadReplies.map((reply) => (
              <article
                key={reply.id}
                data-reply-id={reply.id}
                className="flex gap-3 border-b border-[#aab38a] py-5 pr-6 pl-8"
              >
                <span className="pt-2 text-[#72795e]" aria-hidden="true">
                  └
                </span>
                <img
                  src={reply.user?.profileImage || readerUser.profileImage}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <p>{reply.user?.nickname ?? "독자"}</p>
                  {reply.createdAt && (
                    <time dateTime={reply.createdAt} className="text-[#747b60]">
                      {dateLabel(reply.createdAt)}
                    </time>
                  )}
                  <p className="mt-2 whitespace-pre-wrap break-words leading-5">{reply.text}</p>
                </div>
              </article>
            ))}
        </div>
        <form
          className="shrink-0 border-t border-[#f7f6f1] px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]"
          onSubmit={(event) => {
            event.preventDefault();
            if (!draft.trim() || composing.current || (parent && draft.length > 200)) return;
            scrollToNewReply.current = !!parent;
            onSubmit(draft.trim(), parent?.id);
            setDraft("");
            if (parent) setNotice("답글 작성 완료!");
          }}
        >
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              className="min-w-0 flex-1 rounded-full bg-[#f7f6f1] px-5 py-3 text-sm outline-none placeholder:text-[#b4b4b4]"
              aria-label={parent ? "답글 내용" : "댓글 내용"}
              placeholder={parent ? "답글을 남겨주세요" : "댓글을 남겨주세요"}
              maxLength={parent ? 200 : 2000}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
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
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label={parent ? "답글 전송" : "댓글 전송"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7f6f1] text-[#777f62] disabled:!opacity-100 disabled:text-[#b4b4b4]"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="m3 3 19 9-19 9 4-9zm4 9h15" />
              </svg>
            </button>
          </div>
        </form>
      </section>
      {notice && (
        <div
          role="status"
          className="pointer-events-none absolute top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-[#60605fe6] px-4 py-3 text-sm text-white"
        >
          <span aria-hidden="true">✓</span>
          {notice}
        </div>
      )}
      {confirmation && (
        <CommentConfirmModal
          message={
            confirmation.action === "delete"
              ? "해당 댓글을 정말로 삭제하시겠습니까?"
              : "해당 댓글을 신고하시겠습니까?"
          }
          destructive={confirmation.action === "delete"}
          onCancel={() => {
            setConfirmation(undefined);
            closeRef.current?.focus();
          }}
          onConfirm={() => {
            if (confirmation.action === "delete") {
              onDelete(confirmation.id);
              if (replyTo === confirmation.id) {
                setReplyTo(undefined);
                setDraft("");
              }
              if (editingId === confirmation.id) setEditingId(undefined);
              setNotice("댓글이 삭제되었습니다.");
            } else {
              if (!reportedCommentIds.includes(confirmation.id)) onReport(confirmation.id);
              setNotice("댓글을 신고했습니다.");
            }
            setConfirmation(undefined);
            closeRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}
