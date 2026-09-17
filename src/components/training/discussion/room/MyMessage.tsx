import { MESSAGE_FAILED_LABEL } from "@/constants/training/discussion/roomChat";

import type { ChatMessageStatus } from "@/types/training/chat";

type MyMessageProps = {
  text: string;
  status: ChatMessageStatus;
  onRetry: () => void;
};

export default function MyMessage({ text, status, onRetry }: MyMessageProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <p
        aria-busy={status === "sending"}
        className={`flex max-w-[75%] min-w-27 justify-center rounded-xl bg-[#EFEBE6] px-5 py-2 text-[16px] leading-5 break-words break-keep whitespace-pre-line text-[#2C2A2B] transition-opacity ${
          status === "sending" ? "opacity-60" : ""
        }`}
      >
        <span>{text}</span>
      </p>

      {status === "failed" && (
        <button
          type="button"
          onClick={onRetry}
          className="text-[12px] font-semibold text-[#A1A7AD] underline"
        >
          {MESSAGE_FAILED_LABEL}
        </button>
      )}
    </div>
  );
}
