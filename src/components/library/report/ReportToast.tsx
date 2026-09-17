import { useEffect } from "react";

type ReportToastProps = {
  message: string;
  onClose: () => void;
};

const VISIBLE_MS = 2400;

export default function ReportToast({ message, onClose }: ReportToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, VISIBLE_MS);

    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      className="pointer-events-none fixed top-1/2 left-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#555354ee] px-5 py-3 text-[15px] font-semibold whitespace-nowrap text-white"
    >
      {message}
    </div>
  );
}
