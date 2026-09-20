import PasswordSeenIcon from "@/assets/icons/BookReview/passwordSeen [Vectorized].svg";
import PasswordUnseenIcon from "@/assets/icons/BookReview/passwordUnseenIcon.svg";
import { REPORT_EDITOR } from "@/constants/library/report";

import type { BookReviewVisibility } from "@/types/library/report";

type ReportVisibilityToggleProps = {
  value: BookReviewVisibility;
  onChange: (value: BookReviewVisibility) => void;
};

// 공개면 리티가 학습해 다른 사람의 다른 관점 보기에 요약이 노출됨
export default function ReportVisibilityToggle({ value, onChange }: ReportVisibilityToggleProps) {
  const isPublic = value === "PUBLIC";

  return (
    <button
      type="button"
      aria-pressed={isPublic}
      aria-label={isPublic ? REPORT_EDITOR.publicAriaLabel : REPORT_EDITOR.privateAriaLabel}
      onClick={() => onChange(isPublic ? "PRIVATE" : "PUBLIC")}
      className="flex h-11 w-11 items-center justify-center"
    >
      <img src={isPublic ? PasswordSeenIcon : PasswordUnseenIcon} alt="" className="h-6 w-6" />
    </button>
  );
}
