type Props = {
  likes?: number;
  dislikes?: number;
  pending?: boolean;
  reaction: (vote: "like" | "dislike") => boolean | undefined;
  onVote: (vote: "like" | "dislike") => void;
};
export default function CommentReactionButtons({
  likes,
  dislikes,
  pending,
  reaction,
  onVote,
}: Props) {
  return (
    <>
      {(["like", "dislike"] as const).map((vote) => (
        <button
          type="button"
          key={vote}
          aria-label={vote === "like" ? "좋아요" : "싫어요"}
          aria-pressed={reaction(vote)}
          disabled={pending}
          className={`flex items-center gap-1 rounded border border-[#808080] px-1.5 py-1 ${
            reaction(vote)
              ? "bg-[#777777] text-white hover:bg-[#777777] active:bg-[#777777] focus:bg-[#777777]"
              : "bg-transparent text-[#909090] hover:bg-transparent active:bg-transparent focus:bg-transparent"
          }`}
          onClick={() => onVote(vote)}
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

          <span className="text-[#F7F6F1]">{(vote === "like" ? likes : dislikes) ?? 0}</span>
        </button>
      ))}
    </>
  );
}
