import { START_BUTTON_LABEL } from "@/constants/training/comprehensionChat";

type StartButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

export default function StartButton({ disabled, onClick }: StartButtonProps) {
  return (
    <div className="shrink-0 px-5 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`h-14 w-full rounded-xl text-[16px] font-bold text-white ${
          disabled ? "bg-[#D5D7C9]" : "bg-[#B7BD9E]"
        }`}
      >
        {START_BUTTON_LABEL}
      </button>
    </div>
  );
}
