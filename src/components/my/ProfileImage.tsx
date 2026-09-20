import { useState } from "react";
import defaultProfile from "@/assets/images/defaultProfile.png";

export default function ProfileImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const source = src?.trim() || "";
  return (
    <img
      src={source && failedSource !== source ? source : defaultProfile}
      alt={alt}
      className={className}
      onError={() => setFailedSource(source)}
    />
  );
}
