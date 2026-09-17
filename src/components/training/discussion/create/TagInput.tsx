import { useState, type KeyboardEvent } from "react";

import TagChip from "@/components/training/discussion/shared/TagChip";
import {
  ROOM_FIELD_CLASS,
  ROOM_INFO_STEP,
  ROOM_TAG_MAX_COUNT,
  ROOM_TAG_MAX_LENGTH,
} from "@/constants/training/discussion/room";
import { normalizeTag } from "@/utils/training/discussion/roomForm";

type TagInputProps = {
  id: string;
  describedBy: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
};

export default function TagInput({ id, describedBy, tags, onAdd, onRemove }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const isFull = tags.length >= ROOM_TAG_MAX_COUNT;

  const commit = (raw: string) => {
    const tag = normalizeTag(raw);

    if (tag && !isFull) onAdd(tag);
    setDraft("");
  };

  const handleChange = (value: string) => {
    // 모바일 한글 키보드는 스페이스 keydown이 오지 않아 입력값 끝 문자로 확정
    if (/[\s,]$/.test(value)) {
      commit(value);
      return;
    }

    setDraft(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;

    if (event.key === "Enter") {
      event.preventDefault();
      // 한글 조합이 끝난 뒤의 값으로 확정
      requestAnimationFrame(() => commit(input.value));
      return;
    }

    if (event.key === "Backspace" && input.value === "" && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={`${ROOM_FIELD_CLASS} flex min-h-13.5 flex-wrap items-center gap-1.5 py-2 focus-within:border-[#2C2A2B]`}
    >
      {tags.map((tag) => (
        <TagChip key={tag} label={tag} onRemove={() => onRemove(tag)} />
      ))}

      <input
        id={id}
        aria-describedby={describedBy}
        value={draft}
        disabled={isFull}
        maxLength={ROOM_TAG_MAX_LENGTH + 1}
        placeholder={
          isFull
            ? ROOM_INFO_STEP.tagFullPlaceholder
            : tags.length === 0
              ? ROOM_INFO_STEP.tagRequiredPlaceholder
              : ROOM_INFO_STEP.tagPlaceholder
        }
        enterKeyHint="done"
        autoComplete="off"
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => draft && commit(draft)}
        className="h-8 min-w-28 flex-1 scroll-mb-28 bg-transparent outline-none placeholder:text-[#A89F94] disabled:placeholder:text-[#C4BFB6]"
      />
    </div>
  );
}
