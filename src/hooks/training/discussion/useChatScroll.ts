import { useCallback, useLayoutEffect, useRef } from "react";

type UseChatScrollOptions = {
  firstRowId: string | null;
  lastRowId: string | null;
  isLastRowMine: boolean;
  hasOlder: boolean;
  isFetchingOlder: boolean;
  fetchOlder: () => unknown;
};

const STICK_THRESHOLD_PX = 80;

const LOAD_OLDER_THRESHOLD_PX = 120;

// 첫 진입 읽음 위치 이동, 새 메시지 하단 고정, 이전 메시지 로드 시 위치 유지
export const useChatScroll = ({
  firstRowId,
  lastRowId,
  isLastRowMine,
  hasOlder,
  isFetchingOlder,
  fetchOlder,
}: UseChatScrollOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const isInitializedRef = useRef(false);
  const isNearBottomRef = useRef(true);
  const heightBeforePrependRef = useRef<number | null>(null);
  const previousFirstRowIdRef = useRef<string | null>(null);
  const previousLastRowIdRef = useRef<string | null>(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const distance = container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = distance < STICK_THRESHOLD_PX;

    if (container.scrollTop > LOAD_OLDER_THRESHOLD_PX || !hasOlder || isFetchingOlder) return;

    heightBeforePrependRef.current = container.scrollHeight;
    void fetchOlder();
  }, [hasOlder, isFetchingOlder, fetchOlder]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || lastRowId === null) return;

    const isPrepended =
      firstRowId !== previousFirstRowIdRef.current && heightBeforePrependRef.current !== null;
    const isAppended = lastRowId !== previousLastRowIdRef.current;

    previousFirstRowIdRef.current = firstRowId;
    previousLastRowIdRef.current = lastRowId;

    if (!isInitializedRef.current) {
      isInitializedRef.current = true;

      if (dividerRef.current) dividerRef.current.scrollIntoView({ block: "center" });
      else container.scrollTop = container.scrollHeight;

      return;
    }

    if (isPrepended && heightBeforePrependRef.current !== null) {
      container.scrollTop += container.scrollHeight - heightBeforePrependRef.current;
      heightBeforePrependRef.current = null;
      return;
    }

    if (isAppended && (isLastRowMine || isNearBottomRef.current)) {
      container.scrollTop = container.scrollHeight;
    }
  }, [firstRowId, lastRowId, isLastRowMine]);

  return { containerRef, dividerRef, handleScroll };
};
