import AiProfile from "@/assets/images/Training/AiProfile.png";

import type { ReactNode } from "react";

type RitiMessageProps = {
  showAvatar?: boolean;
  children: ReactNode;
};

export default function RitiMessage({ showAvatar = true, children }: RitiMessageProps) {
  return (
    <div className="flex items-start gap-3">
      {showAvatar ? (
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#898D73] bg-white">
          {/* 리티 프로필 이미지 */}
          <img
            src={AiProfile}
            alt="리티"
            className="absolute -bottom-1 left-1/2 h-15 w-auto max-w-none -translate-x-1/2 object-contain"
          />
        </span>
      ) : (
        // 아바타 자리 맞춤 여백
        <span aria-hidden="true" className="h-0 w-14 shrink-0" />
      )}

      {/* 메시지 본문 영역 */}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3">{children}</div>
    </div>
  );
}
