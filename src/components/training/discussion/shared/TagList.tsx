import TagChip from "@/components/training/discussion/shared/TagChip";

type TagListProps = {
  tags: string[];
  // 지정 시 한 줄로 자르고 나머지는 +N 표시
  maxVisible?: number;
  className?: string;
};

export default function TagList({ tags, maxVisible, className = "" }: TagListProps) {
  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = tags.length - visibleTags.length;

  if (tags.length === 0) return null;

  return (
    <ul
      className={`flex gap-1.5 ${maxVisible ? "overflow-hidden" : "flex-wrap"} ${className}`}
      aria-label="태그"
    >
      {visibleTags.map((tag) => (
        <li key={tag}>
          <TagChip label={tag} />
        </li>
      ))}

      {hiddenCount > 0 && (
        <li>
          <TagChip label={`+${hiddenCount}`} />
        </li>
      )}
    </ul>
  );
}
