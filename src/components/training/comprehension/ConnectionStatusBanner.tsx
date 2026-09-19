import type { ChatConnectionStatus } from "@/types/training/chatSocket";

// 토론방 채팅에서만 쓰는 연결 안내 문구
const RECONNECTING_TEXT = "연결이 끊겨 다시 연결하는 중입니다";

const RECONNECT_FAILED_TEXT = "연결에 실패했습니다";

const RETRY_BUTTON_LABEL = "다시 시도";

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
