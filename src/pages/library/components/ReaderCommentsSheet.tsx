import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { ReaderComment } from "../utils/useReaderData";

import ProfileImage from "@/components/my/ProfileImage";
import CommentConfirmModal from "./CommentConfirmModal";

const editButtonClass =
  "min-h-7 rounded border border-[#909090] bg-transparent text-[#F7F6F1] active:text-white";
const saveButtonClass = `${editButtonClass} active:bg-[#777777]`;
const cancelButtonClass = `${editButtonClass} active:bg-[#493d3c]`;

type Props = {
  comments: ReaderComment[];
  replies: ReaderComment[];
  pageNumber: number;
  onClose: () => void;
  onSubmit: (text: string, replyTo?: string) => void | Promise<boolean>;
  onVote: (id: string, vote: "like" | "dislike") => void;
  onDelete: (id: string) => void | Promise<boolean>;
  onEdit: (id: string, text: string) => void | Promise<boolean>;
  onReport: (id: string) => void;
  reportedCommentIds: string[];
  apiState?: {
    currentUserId: number | null;
    pending: boolean;
    loading: boolean;
    error: boolean;
    onRetry: () => void;
    hasNext: boolean;
    loadingMore: boolean;
    onLoadMore: () => void;
    onSortChange: (sort: "LATEST" | "POPULAR") => void;
    onThreadChange: (id?: string) => void;
    reaction: (id: string, vote: "like" | "dislike") => boolean | undefined;
    total?: number;
  };
};

const dateLabel = (value?: string) => {
  if (!value || Number.isNaN(Date.parse(value))) return "";

  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
  apiState,
}: Props) {
  const [tab, setTab] = useState(apiState ? "latest" : "popular");

  const [draft, setDraft] = useState("");

  // 현재 답글 화면으로 들어간 원댓글 id
  const [replyTo, setReplyTo] = useState<string>();

  // 댓글 / 답글 ⋮ 메뉴
  const [menu, setMenu] = useState<string>();

  // 댓글 / 답글 수정
  const [editingId, setEditingId] = useState<string>();
  const [editText, setEditText] = useState("");

  // 삭제 / 신고 확인창
  const [confirmation, setConfirmation] = useState<{
    id: string;
    action: "delete" | "report";
  }>();

  const [notice, setNotice] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const commentScroll = useRef(0);
  const scrollToNewReply = useRef(false);

  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const composing = useRef(false);

  // 현재 답글 화면의 원댓글
  const parent = comments.find((comment) => comment.id === replyTo);

  const parentId = parent?.id;

  // 현재 원댓글에 달린 답글
  const threadReplies = replies.filter(
    (reply) => (reply.parentCommentId ?? reply.replyTo) === parent?.id,
  );

  // 삭제 / 신고 대상이 답글인지 확인
  const confirmationIsReply = confirmation
    ? replies.some((reply) => reply.id === confirmation.id)
    : false;

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!menu) return;

    const outside = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-comment-menu]")) {
        setMenu(undefined);
      }
    };

    document.addEventListener("pointerdown", outside);

    return () => document.removeEventListener("pointerdown", outside);
  }, [menu]);

  // toast 자동 제거
  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [notice]);

  // 처음 열릴 때 닫기 버튼 focus
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;

    closeRef.current?.focus();

    return () => previous?.focus();
  }, []);

  // 답글 화면 → 댓글 목록으로 돌아가기
  const back = () => {
    if (!replyTo) {
      onClose();
      return;
    }

    setReplyTo(undefined);
    apiState?.onThreadChange();
    setDraft("");
    setMenu(undefined);
    setEditingId(undefined);
  };

  // 댓글 목록 / 답글 목록 진입 시 스크롤 위치 처리
  useLayoutEffect(() => {
    if (!listRef.current) return;

    listRef.current.scrollTop = parentId ? 0 : commentScroll.current;
  }, [parentId]);

  // 새 답글 작성 후 맨 아래로 이동
  useLayoutEffect(() => {
    if (!scrollToNewReply.current || !listRef.current) {
      return;
    }

    listRef.current.scrollTop = listRef.current.scrollHeight;

    scrollToNewReply.current = false;
  }, [threadReplies.length]);

  // 댓글 목록 정렬
  const shown = parent
    ? [parent]
    : apiState
      ? tab === "popular"
        ? comments.filter((comment) => (comment.likes ?? 0) > 0)
        : comments
      : comments
          .filter((comment) => tab !== "popular" || (comment.likes ?? 0) > 0)
          .filter((comment) => tab !== "fan" || comment.user?.isFan)
          .sort((a, b) => {
            if (tab === "popular" && (a.likes ?? 0) !== (b.likes ?? 0)) {
              return (b.likes ?? 0) - (a.likes ?? 0);
            }

            return (Date.parse(b.createdAt ?? "") || 0) - (Date.parse(a.createdAt ?? "") || 0);
          });

  return (
    <div className="book-reader__sheet-backdrop !bg-transparent" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reader-comments-title"
        aria-description={`${pageNumber}페이지 댓글`}
        className="[&_button]:[-webkit-tap-highlight-color:transparent] [&_button:focus]:outline-none! [&_button:focus-visible]:ring-2 [&_button:focus-visible]:ring-[#8b956d] flex h-[82dvh] max-h-[calc(100dvh-24px)] w-full max-w-[390px] flex-col overflow-hidden rounded-t-[20px] bg-[#4F4D4E] text-[#F7F6F1] shadow-[0_-4px_20px_#00000008]"
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

          const first = controls[0];
          const last = controls.at(-1);

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between px-7 pt-5 pb-3">
          <h2 id="reader-comments-title" className="text-xl font-semibold">
            {parent
              ? `답글 (${parent.replyCount ?? threadReplies.length})`
              : `댓글 (${apiState?.total ?? comments.length})`}
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

        {/* Tabs */}
        <div
          className="grid shrink-0 grid-cols-3 border-b-4 border-[#808080] px-4"
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
              disabled={!!apiState && (key === "fan" || apiState.pending || !!parent)}
              className={`relative min-h-12 text-sm ${
                tab === key
                  ? "font-bold after:absolute after:-bottom-1 after:left-[12%] after:h-1 after:w-3/4 after:bg-[#F7F6F1]"
                  : "font-normal text-[#909090]"
              }`}
              onClick={() => {
                setTab(key);
                apiState?.onSortChange(key === "popular" ? "POPULAR" : "LATEST");
                setMenu(undefined);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 댓글 / 답글 영역 */}
        <div
          ref={listRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          aria-live="polite"
        >
          {apiState?.loading && (
            <p role="status" className="px-7 py-4 text-sm">
              댓글을 불러오는 중입니다.
            </p>
          )}
          {apiState?.error && (
            <p role="alert" className="px-7 py-4 text-sm">
              댓글 요청을 완료하지 못했습니다. 입력을 유지한 채 다시 시도할 수 있습니다.
              <button type="button" onClick={apiState.onRetry} className="ml-2 underline">
                목록 다시 불러오기
              </button>
            </p>
          )}
          {!parent && shown.length === 0 && !apiState?.loading && !apiState?.error && (
            <p className="px-7 py-10 text-center text-sm text-[#A3A3A3]">
              {tab === "popular"
                ? "아직 인기 댓글이 없습니다."
                : tab === "fan"
                  ? "아직 찐팬 댓글이 없습니다."
                  : "이 페이지에 첫 의견을 남겨보세요."}
            </p>
          )}

          {/* 원댓글 / 댓글 목록 */}
          {shown.map((comment) => (
            <article key={comment.id} className="relative border-b border-[#808080] px-6 pt-4 pb-5">
              <div className="flex gap-4">
                {/* Profile */}
                <div className="flex w-12 shrink-0 flex-col items-center gap-3">
                  <ProfileImage
                    src={comment.user?.profileImage}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  {tab === "popular" && (comment.likes ?? 0) > 0 && (
                    <span className="rounded-full border border-[#F7F6F1] px-2 py-0.5 text-xs font-semibold text-[#F7F6F1]">
                      BEST
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="pr-6 text-sm">{comment.user?.nickname ?? "독자"}</div>

                  {comment.createdAt && (
                    <time dateTime={comment.createdAt} className="text-sm text-[#A3A3A3]">
                      {dateLabel(comment.createdAt)}
                    </time>
                  )}

                  {/* 문장 댓글 quote */}
                  {comment.quote && (
                    <p
                      title={comment.quote}
                      className="mt-2 line-clamp-2 text-xs break-words text-[#C7C7C7]"
                    >
                      {comment.quote}
                    </p>
                  )}

                  {/* 수정 모드 */}
                  {editingId === comment.id ? (
                    <form
                      className="mt-2"
                      onSubmit={async (event) => {
                        event.preventDefault();

                        if (!editText.trim() || editText.length > 200) {
                          return;
                        }

                        if (apiState?.pending || (await onEdit(comment.id, editText)) === false)
                          return;

                        setEditingId(undefined);
                        setNotice("댓글이 수정되었습니다.");
                      }}
                    >
                      <div className="bg-[#606060] px-2 pt-2 pb-1">
                        <textarea
                          autoFocus
                          aria-label="댓글 수정"
                          className="min-h-16 w-full resize-y bg-transparent text-sm leading-5 outline-none"
                          maxLength={200}
                          value={editText}
                          readOnly={apiState?.pending}
                          onChange={(event) => setEditText(event.target.value)}
                        />

                        <div className="text-right text-[10px] text-[#A3A3A3]" aria-live="polite">
                          {editText.length}/200
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="submit"
                          disabled={apiState?.pending || !editText.trim() || editText.length > 200}
                          className={saveButtonClass}
                        >
                          수정완료
                        </button>

                        <button
                          type="button"
                          className={cancelButtonClass}
                          onClick={() => setEditingId(undefined)}
                        >
                          취소하기
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p
                      className={`${
                        comment.quote ? "" : "mt-2"
                      } whitespace-pre-wrap break-words text-sm leading-5`}
                    >
                      {comment.text}
                    </p>
                  )}
                </div>
              </div>

              {/* 댓글 더보기 */}
              <div className="absolute top-3 right-3" data-comment-menu>
                <button
                  type="button"
                  aria-label="댓글 더보기"
                  aria-expanded={menu === comment.id}
                  className="h-8 w-6 text-xl text-[#A3A3A3]"
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
                      className="min-h-9 w-full bg-transparent px-3 text-[#141610] hover:bg-black/5 active:bg-transparent focus:bg-transparent"
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditText(comment.text);
                        setMenu(undefined);
                      }}
                      disabled={
                        !!apiState &&
                        (apiState.pending || apiState.currentUserId !== comment.user?.id)
                      }
                    >
                      수정하기
                    </button>

                    <button
                      type="button"
                      className="min-h-9 w-full bg-transparent px-3 text-[#141610] hover:bg-black/5 active:bg-transparent focus:bg-transparent"
                      disabled={
                        !!apiState &&
                        (apiState.pending || apiState.currentUserId !== comment.user?.id)
                      }
                      onClick={() => {
                        setConfirmation({
                          id: comment.id,
                          action: "delete",
                        });

                        setMenu(undefined);
                      }}
                    >
                      삭제하기
                    </button>

                    <button
                      type="button"
                      disabled={!!apiState || reportedCommentIds.includes(comment.id)}
                      className="min-h-9 w-full bg-transparent px-3 text-[#141610] hover:bg-black/5 active:bg-transparent focus:bg-transparent"
                      onClick={() => {
                        setConfirmation({
                          id: comment.id,
                          action: "report",
                        });

                        setMenu(undefined);
                      }}
                    >
                      {reportedCommentIds.includes(comment.id) ? "신고 완료" : "신고하기"}
                    </button>
                  </div>
                )}
              </div>

              {/* 답글 + 좋아요 / 싫어요 */}
              {editingId !== comment.id && (
                <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#909090]">
                  <button
                    type="button"
                    className="rounded border border-[#808080] bg-transparent px-3 py-1 text-[#909090] hover:bg-transparent active:bg-transparent focus:bg-transparent"
                    disabled={apiState?.pending}
                    onClick={() => {
                      if (parent) {
                        inputRef.current?.focus();
                        return;
                      }

                      commentScroll.current = listRef.current?.scrollTop ?? 0;

                      setReplyTo(comment.id);
                      apiState?.onThreadChange(comment.id);
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
                        aria-pressed={
                          apiState ? apiState.reaction(comment.id, vote) : comment.myVote === vote
                        }
                        disabled={apiState?.pending}
                        className={`flex items-center gap-1 rounded border border-[#808080] px-1.5 py-1 ${
                          (apiState ? apiState.reaction(comment.id, vote) : comment.myVote === vote)
                            ? "bg-[#777777] text-white hover:bg-[#777777] active:bg-[#777777] focus:bg-[#777777]"
                            : "bg-transparent text-[#909090] hover:bg-transparent active:bg-transparent focus:bg-transparent"
                        }`}
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

                        <span className="text-[#F7F6F1]">
                          {(vote === "like" ? comment.likes : comment.dislikes) ?? 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}

          {/* 답글이 없을 때 */}
          {parent && threadReplies.length === 0 && !apiState?.loading && !apiState?.error && (
            <p className="px-7 py-8 text-center text-sm text-[#A3A3A3]">첫 답글을 남겨보세요.</p>
          )}

          {/* 답글 목록 */}
          {parent &&
            threadReplies.map((reply) => (
              <article
                key={reply.id}
                data-reply-id={reply.id}
                className="relative flex gap-3 border-b border-[#808080] py-5 pr-6 pl-8"
              >
                {/* 답글 표시 */}
                <span className="pt-2 text-[#A3A3A3]" aria-hidden="true">
                  └
                </span>

                {/* 프로필 */}
                <ProfileImage
                  src={reply.user?.profileImage}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1 text-sm">
                  <p>{reply.user?.nickname ?? "독자"}</p>

                  {reply.createdAt && (
                    <time dateTime={reply.createdAt} className="text-[#A3A3A3]">
                      {dateLabel(reply.createdAt)}
                    </time>
                  )}

                  {/* 답글 수정 */}
                  {editingId === reply.id ? (
                    <form
                      className="mt-2"
                      onSubmit={async (event) => {
                        event.preventDefault();

                        if (!editText.trim() || editText.length > 200) {
                          return;
                        }

                        if (apiState?.pending || (await onEdit(reply.id, editText)) === false)
                          return;

                        setEditingId(undefined);
                        setNotice("답글이 수정되었습니다.");
                      }}
                    >
                      <div className="bg-[#606060] px-2 pt-2 pb-1">
                        <textarea
                          autoFocus
                          aria-label="답글 수정"
                          className="min-h-16 w-full resize-y bg-transparent text-sm leading-5 outline-none"
                          maxLength={200}
                          value={editText}
                          readOnly={apiState?.pending}
                          onChange={(event) => setEditText(event.target.value)}
                        />

                        <div className="text-right text-[10px] text-[#A3A3A3]" aria-live="polite">
                          {editText.length}/200
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="submit"
                          disabled={apiState?.pending || !editText.trim() || editText.length > 200}
                          className={saveButtonClass}
                        >
                          수정완료
                        </button>

                        <button
                          type="button"
                          className={cancelButtonClass}
                          onClick={() => setEditingId(undefined)}
                        >
                          취소하기
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="mt-2 whitespace-pre-wrap break-words leading-5">{reply.text}</p>
                  )}

                  {/* 답글 좋아요 / 싫어요 */}
                  {editingId !== reply.id && (
                    <div className="mt-4 flex justify-end gap-2 text-xs font-semibold text-[#909090]">
                      {(["like", "dislike"] as const).map((vote) => (
                        <button
                          type="button"
                          key={vote}
                          aria-label={vote === "like" ? "좋아요" : "싫어요"}
                          aria-pressed={
                            apiState ? apiState.reaction(reply.id, vote) : reply.myVote === vote
                          }
                          disabled={apiState?.pending}
                          className={`flex items-center gap-1 rounded border border-[#808080] px-1.5 py-1 ${
                            (apiState ? apiState.reaction(reply.id, vote) : reply.myVote === vote)
                              ? "bg-[#777777] text-white hover:bg-[#777777] active:bg-[#777777] focus:bg-[#777777]"
                              : "bg-transparent text-[#909090] hover:bg-transparent active:bg-transparent focus:bg-transparent"
                          }`}
                          onClick={() => onVote(reply.id, vote)}
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

                          <span className="text-[#F7F6F1]">
                            {(vote === "like" ? reply.likes : reply.dislikes) ?? 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 답글 ⋮ 메뉴 */}
                <div className="absolute top-3 right-3" data-comment-menu>
                  <button
                    type="button"
                    aria-label="답글 더보기"
                    aria-expanded={menu === reply.id}
                    className="h-8 w-6 text-xl text-[#A3A3A3]"
                    onClick={() => setMenu(menu === reply.id ? undefined : reply.id)}
                  >
                    ⋮
                  </button>

                  {menu === reply.id && (
                    <div
                      className="absolute top-8 right-0 z-10 w-24 overflow-hidden rounded-xl bg-[#f7f6f1] py-2 text-xs shadow-lg"
                      aria-label="답글 관리"
                    >
                      <button
                        type="button"
                        className="min-h-9 w-full bg-transparent px-3 text-[#141610] hover:bg-black/5 active:bg-transparent focus:bg-transparent"
                        onClick={() => {
                          setEditingId(reply.id);
                          setEditText(reply.text);
                          setMenu(undefined);
                        }}
                        disabled={
                          !!apiState &&
                          (apiState.pending || apiState.currentUserId !== reply.user?.id)
                        }
                      >
                        수정하기
                      </button>

                      <button
                        type="button"
                        className="min-h-9 w-full bg-transparent px-3 text-[#141610] hover:bg-black/5 active:bg-transparent focus:bg-transparent"
                        disabled={
                          !!apiState &&
                          (apiState.pending || apiState.currentUserId !== reply.user?.id)
                        }
                        onClick={() => {
                          setConfirmation({
                            id: reply.id,
                            action: "delete",
                          });

                          setMenu(undefined);
                        }}
                      >
                        삭제하기
                      </button>

                      <button
                        type="button"
                        disabled={!!apiState || reportedCommentIds.includes(reply.id)}
                        className="min-h-9 w-full bg-transparent px-3 text-[#141610] hover:bg-black/5 active:bg-transparent focus:bg-transparent"
                        onClick={() => {
                          setConfirmation({
                            id: reply.id,
                            action: "report",
                          });

                          setMenu(undefined);
                        }}
                      >
                        {reportedCommentIds.includes(reply.id) ? "신고 완료" : "신고하기"}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          {apiState?.hasNext && (
            <button
              type="button"
              disabled={apiState.loadingMore}
              onClick={apiState.onLoadMore}
              className="min-h-11 w-full text-sm"
            >
              {apiState.loadingMore ? "불러오는 중…" : "더 보기"}
            </button>
          )}
        </div>

        {/* 댓글 / 답글 입력 */}
        <form
          className="shrink-0 border-t border-[#f7f6f1] px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]"
          onSubmit={async (event) => {
            event.preventDefault();

            if (!draft.trim() || composing.current || (parent && draft.length > 200)) {
              return;
            }

            scrollToNewReply.current = !!parent;

            if (apiState?.pending || (await onSubmit(draft.trim(), parent?.id)) === false) return;

            setDraft("");

            if (parent) {
              setNotice("답글 작성 완료!");
            }
          }}
        >
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              className="min-w-0 flex-1 rounded-full border border-[#B4B4B4] bg-[#F7F6F1] px-5 py-3 text-sm text-[#4F4D4E] outline-none placeholder:text-[#b4b4b4]"
              aria-label={parent ? "답글 내용" : "댓글 내용"}
              placeholder={parent ? "답글을 남겨주세요" : "댓글을 남겨주세요"}
              maxLength={parent ? 200 : 2000}
              value={draft}
              readOnly={apiState?.pending}
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
                ) {
                  event.preventDefault();
                }
              }}
            />

            <button
              type="submit"
              disabled={!draft.trim() || apiState?.pending}
              aria-label={parent ? "답글 전송" : "댓글 전송"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#B4B4B4] bg-[#F7F6F1] text-[#4F4D4E] disabled:!opacity-100 disabled:text-[#b4b4b4]"
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

      {/* Toast */}
      {notice && (
        <div
          role="status"
          className="pointer-events-none absolute top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-[#60605fe6] px-4 py-3 text-sm text-white"
        >
          <span aria-hidden="true">✓</span>
          {notice}
        </div>
      )}

      {/* 삭제 / 신고 모달 */}
      {confirmation && (
        <CommentConfirmModal
          message={
            confirmation.action === "delete"
              ? `해당 ${confirmationIsReply ? "답글" : "댓글"}을 정말로 삭제하시겠습니까?`
              : `해당 ${confirmationIsReply ? "답글" : "댓글"}을 신고하시겠습니까?`
          }
          destructive={confirmation.action === "delete"}
          onCancel={() => {
            setConfirmation(undefined);
            closeRef.current?.focus();
          }}
          onConfirm={async () => {
            if (apiState?.pending) return;
            if (confirmation.action === "delete") {
              if ((await onDelete(confirmation.id)) === false) return;

              // 원댓글 자체를 삭제한 경우
              if (replyTo === confirmation.id) {
                setReplyTo(undefined);
                apiState?.onThreadChange();
                setDraft("");
              }

              if (editingId === confirmation.id) {
                setEditingId(undefined);
              }

              setNotice(confirmationIsReply ? "답글이 삭제되었습니다." : "댓글이 삭제되었습니다.");
            } else {
              if (!reportedCommentIds.includes(confirmation.id)) {
                onReport(confirmation.id);
              }

              setNotice(confirmationIsReply ? "답글을 신고했습니다." : "댓글을 신고했습니다.");
            }

            setConfirmation(undefined);
            closeRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}
