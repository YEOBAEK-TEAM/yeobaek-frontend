import { Check, Copy } from "lucide-react";
import { useId } from "react";

import DiscussionModal from "@/components/training/discussion/shared/DiscussionModal";
import { INVITE_CODE_MODAL } from "@/constants/training/discussion/roomChat";
import { useCopyToClipboard } from "@/hooks/training/discussion/useCopyToClipboard";

type InviteCodeModalProps = {
  code: string;
  onClose: () => void;
};

export default function InviteCodeModal({ code, onClose }: InviteCodeModalProps) {
  const labelId = useId();

  const { status, copy } = useCopyToClipboard();

  const CopyIcon = status === "copied" ? Check : Copy;

  return (
    <DiscussionModal
      labelledBy={labelId}
      onClose={onClose}
      className="max-w-68 rounded-[18px] bg-[#FBFBFB]"
    >
      <div className="px-5.5 pt-5 pb-4">
        <p id={labelId} className="sr-only">
          {INVITE_CODE_MODAL.label}
        </p>

        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-[34px] leading-none font-bold text-[#2C2A2B]">
            #
          </span>

          <p className="h-11 min-w-0 flex-1 truncate border-b-2 border-[#2C2A2B] px-1 text-[26px] leading-10 tracking-[0.04em] text-[#2C2A2B] tabular-nums select-all">
            {code}
          </p>

          <button
            type="button"
            onClick={() => void copy(code)}
            aria-label={INVITE_CODE_MODAL.copyLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[#2C2A2B]"
          >
            <CopyIcon aria-hidden="true" strokeWidth={2.25} className="h-6 w-6" />
          </button>
        </div>

        <p aria-live="polite" className="min-h-5 pt-1.5 pl-8 text-[13px] text-[#8F8B85]">
          {status === "copied" && INVITE_CODE_MODAL.copiedText}
          {status === "failed" && INVITE_CODE_MODAL.copyFailedText}
        </p>
      </div>
    </DiscussionModal>
  );
}
