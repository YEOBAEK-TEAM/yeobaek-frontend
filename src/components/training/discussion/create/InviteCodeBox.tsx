import { ROOM_CREATED } from "@/constants/training/discussion/room";
import { useCopyToClipboard } from "@/hooks/training/discussion/useCopyToClipboard";

type InviteCodeBoxProps = {
  code: string;
};

export default function InviteCodeBox({ code }: InviteCodeBoxProps) {
  const { status, copy } = useCopyToClipboard();

  return (
    <div className="px-12.5">
      <div className="flex items-center justify-between">
        <p className="flex flex-col items-center">
          <span className="text-[15px] text-[#2C2A2B]">{ROOM_CREATED.inviteCodeLabel}</span>
          <span className="mt-1 text-[17px] font-medium tracking-[0.08em] text-[#2C2A2B] tabular-nums select-all">
            {code}
          </span>
        </p>

        <button
          type="button"
          onClick={() => void copy(code)}
          className="h-9 w-25 rounded-xl bg-[#F0ECE6] text-[16px] font-medium text-[#4F4D4E] active:bg-[#E6E1D8]"
        >
          <span aria-live="polite">
            {status === "copied" ? ROOM_CREATED.copiedLabel : ROOM_CREATED.copyLabel}
          </span>
        </button>
      </div>

      {status === "failed" && (
        <p role="alert" className="mt-2 text-[13px] break-keep text-[#D91414]">
          {ROOM_CREATED.copyFailedText}
        </p>
      )}
    </div>
  );
}
