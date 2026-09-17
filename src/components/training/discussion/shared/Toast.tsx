import { Check } from "lucide-react";
import { useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

const VISIBLE_MS = 2400;

// 하단 탭바 위에 잠깐 떴다 사라지는 안내
export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, VISIBLE_MS);

    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-28 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#555354ee] px-5 py-3 text-[15px] font-semibold whitespace-nowrap text-white"
    >
      <Check aria-hidden="true" strokeWidth={2.5} className="h-4 w-4" />
      {message}
    </div>
  );
}
