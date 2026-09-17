import { LoaderCircle } from "lucide-react";

type FunnelFooterButtonProps = {
  label: string;
  disabled: boolean;
  isLoading?: boolean;
  onClick: () => void;
};

// 스크롤해도 하단에 붙어 있는 단계 이동 버튼
export default function FunnelFooterButton({
  label,
  disabled,
  isLoading = false,
  onClick,
}: FunnelFooterButtonProps) {
  return (
    <div className="sticky bottom-0 bg-[#FFFEFB] px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
      <button
        type="button"
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        onClick={onClick}
        className="flex h-13.5 w-full items-center justify-center gap-2 rounded-2xl bg-[#B8BC9F] text-[18px] font-bold text-white disabled:bg-[#D5D7C9]"
      >
        {isLoading && (
          <LoaderCircle
            aria-hidden="true"
            className="h-5 w-5 animate-spin motion-reduce:animate-none"
          />
        )}
        {label}
      </button>
    </div>
  );
}
