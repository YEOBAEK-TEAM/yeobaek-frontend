export type ChatAction = {
  id: string;
  label: string;
  variant: "primary" | "dark" | "outline";
  onClick: () => void;
  disabled?: boolean;
};

const VARIANT_CLASS = {
  primary: "bg-[#B7BD9E] text-white",
  dark: "bg-[#4F4D4E] text-white",
  outline: "border border-[#C4BFB6] bg-white text-[#54555A]",
};

export default function ChatActionButtons({ actions }: { actions: ChatAction[] }) {
  return (
    <div className="shrink-0 space-y-3 px-5 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className={`h-13 w-full rounded-xl text-[15px] font-bold disabled:opacity-50 ${VARIANT_CLASS[action.variant]}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
