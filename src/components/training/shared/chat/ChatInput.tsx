import { ArrowUp } from "lucide-react";
import { useRef, useState } from "react";

import { CHAT_INPUT_PLACEHOLDER } from "@/constants/training/bookReportChat";

type ChatInputProps = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

const MAX_HEIGHT_PX = 120;

export default function ChatInput({ disabled, onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const canSend = value.trim().length > 0 && !disabled;

  const resize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT_PX)}px`;
  };

  const submit = () => {
    if (!canSend) return;

    onSend(value.trim());
    setValue("");

    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = "auto";
  };

  return (
    <div className="shrink-0 px-5 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
      <div className="flex items-end gap-2 rounded-2xl border border-[#C4BFB6] bg-white py-2 pr-2 pl-4">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          placeholder={CHAT_INPUT_PLACEHOLDER}
          aria-label="채팅 입력"
          onChange={(event) => {
            setValue(event.target.value);
            resize();
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" || event.shiftKey) return;

            // IME 조합 중 Enter 전송 방지
            if (isComposing || event.nativeEvent.isComposing) return;

            event.preventDefault();
            submit();
          }}
          className="max-h-30 flex-1 resize-none bg-transparent py-2 text-[14px] font-medium text-[#54555A] outline-none placeholder:text-[#A1A7AD]"
        />

        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="전송"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${
            canSend ? "bg-[#7A828B]" : "bg-[#A1A7AD]"
          }`}
        >
          <ArrowUp aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
