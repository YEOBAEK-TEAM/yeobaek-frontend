import { useState } from "react";

import { DEFAULT_PROFILE_IMAGE } from "@/constants/training/discussion/discussion";

import type { HostParticipantsView } from "@/types/training/discussion/discussion";

type HostParticipantsProps = {
  host: HostParticipantsView;
  className?: string;
};

export default function HostParticipants({ host, className = "" }: HostParticipantsProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  // 프로필 이미지 없음·로드 실패 시 기본 아바타
  const source =
    host.imageUrl && failedSource !== host.imageUrl ? host.imageUrl : DEFAULT_PROFILE_IMAGE;

  return (
    <p
      className={`flex min-w-0 items-center gap-1.5 text-[12px] leading-5 font-medium text-[#54555A] ${className}`}
    >
      <img
        src={source}
        alt=""
        onError={() => setFailedSource(host.imageUrl)}
        className="h-5 w-5 shrink-0 rounded-full object-cover"
      />

      <span className="truncate">
        {host.hostLabel}
        <span aria-hidden="true" className="px-1.5">
          ·
        </span>
        {host.participantText}
      </span>
    </p>
  );
}
