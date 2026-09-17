type QuizFooterButtonProps = {
  label: string;
  disabled: boolean;
  onClick: () => void;
};

export default function QuizFooterButton({ label, disabled, onClick }: QuizFooterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-16 w-full rounded-xl bg-[#B8BC9F] text-[17px] font-bold text-white transition-colors duration-200 disabled:bg-[#A6A6A6]"
    >
      {label}
    </button>
  );
}
