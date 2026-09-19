import { useCallback, useEffect, useRef, useState } from "react";

const TRANSITION_MS = 280;

type SheetSlideInOptions = {
  lockScroll?: boolean;
};

// 하단 시트가 스르륵 올라오고 내려가도록 여닫는 트랜지션
export const useSheetSlideIn = (
  onClose: () => void,
  { lockScroll = false }: SheetSlideInOptions = {},
) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;

    dialog?.showModal();
    if (lockScroll) document.body.style.overflow = "hidden";

    // 시트 올라오는 트랜지션 시작
    const raf = requestAnimationFrame(() => setEntered(true));

    return () => {
      cancelAnimationFrame(raf);
      dialog?.close();
      if (lockScroll) document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [lockScroll]);

  // 내려가는 트랜지션 후 닫기 실행
  useEffect(() => {
    if (!leaving) return;

    const timer = window.setTimeout(onClose, TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [leaving, onClose]);

  const requestClose = useCallback(() => setLeaving(true), []);

  const sheetStyle = {
    transform: `translateY(${!entered || leaving ? "100%" : "0px"})`,
    transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.32,0.72,0,1)`,
  };

  // 딤도 함께 서서히 나타나는 클래스
  const backdropClassName = `backdrop:transition-colors backdrop:duration-300 ${
    entered && !leaving ? "backdrop:bg-black/35" : "backdrop:bg-black/0"
  }`;

  return { dialogRef, sheetStyle, backdropClassName, requestClose };
};
