import { useState } from "react";

import { DEFAULT_PROFILE_IMAGE } from "@/constants/training/discussion/discussion";

type ProfileAvatarProps = {
  src: string | null;
  className: string;
};

export default function ProfileAvatar({ src, className }: ProfileAvatarProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  const source = src && failedSource !== src ? src : DEFAULT_PROFILE_IMAGE;

  return (
    <img
      src={source}
      alt=""
      onError={() => setFailedSource(src)}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}
