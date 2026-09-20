import { useEffect } from "react";
export default function VocabularyToast({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2400);
    return () => window.clearTimeout(timer);
  }, [onClose]);
  return (
    <div
      role="status"
      className="pointer-events-none fixed top-1/2 left-1/2 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-[#555354ee] px-5 py-3 text-base font-semibold text-white"
    >
      <span aria-hidden="true">✓</span>변경사항이 저장됐습니다
    </div>
  );
}
