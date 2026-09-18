import { Check } from "lucide-react";
import { useEffect } from "react";

import { useToastStore } from "@/stores/common/toast";

const VISIBLE_MS = 2400;

// 모든 토스트를 같은 모양으로 화면 중앙에 표시
export default function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const hideToast = useToastStore((state) => state.hideToast);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => hideToast(toast.id), VISIBLE_MS);

    return () => window.clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      role="status"
      className="pointer-events-none fixed top-1/2 left-1/2 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl bg-[#555354ee] px-5 py-3 text-base font-semibold whitespace-nowrap text-white"
    >
      {toast.tone === "success" && (
        <Check aria-hidden="true" strokeWidth={2.5} className="h-4 w-4 shrink-0" />
      )}
      {toast.message}
    </div>
  );
}
