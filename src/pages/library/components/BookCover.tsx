import { useState } from "react";
export default function BookCover({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className: string;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (!src || failedSource === src)
    return (
      <div
        role="img"
        aria-label={`${title} 표지 없음`}
        className={`${className} flex min-h-23 items-center justify-center bg-[#E7E1D6] text-xs text-[#747474]`}
      >
        표지 없음
      </div>
    );
  return (
    <img
      src={src}
      alt={`${title} 표지`}
      className={className}
      onError={() => setFailedSource(src)}
    />
  );
}
