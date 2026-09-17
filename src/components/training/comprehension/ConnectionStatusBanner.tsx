import {
  RECONNECT_FAILED_TEXT,
  RECONNECTING_TEXT,
  RETRY_BUTTON_LABEL,
} from "@/constants/training/comprehensionChat";

import type { ChatConnectionStatus } from "@/types/training/chatSocket";

type ConnectionStatusBannerProps = {
  status: ChatConnectionStatus;
  onRetry: () => void;
};

export default function ConnectionStatusBanner({ status, onRetry }: ConnectionStatusBannerProps) {
  if (status !== "reconnecting" && status !== "error") return null;

  return (
    <div
      role="status"
      className="mx-5 mb-2 flex shrink-0 items-center justify-between rounded-lg bg-[#F0ECE3] px-4 py-2 text-[13px] text-[#60564C]"
    >
      <span>{status === "error" ? RECONNECT_FAILED_TEXT : RECONNECTING_TEXT}</span>

      {status === "error" && (
        <button type="button" onClick={onRetry} className="font-bold underline">
          {RETRY_BUTTON_LABEL}
        </button>
      )}
    </div>
  );
}
