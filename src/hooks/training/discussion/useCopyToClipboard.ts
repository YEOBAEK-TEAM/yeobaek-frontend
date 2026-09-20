import { useEffect, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

const RESET_DELAY_MS: Record<Exclude<CopyStatus, "idle">, number> = {
  copied: 1500,
  failed: 4000,
};

export const useCopyToClipboard = () => {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status === "idle") return;

    const timer = window.setTimeout(() => setStatus("idle"), RESET_DELAY_MS[status]);

    return () => window.clearTimeout(timer);
  }, [status]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return { status, copy };
};
