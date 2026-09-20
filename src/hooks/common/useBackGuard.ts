import { useCallback, useEffect, useRef } from "react";

const GUARD_KEY = "backGuard";

const isGuardEntry = () =>
  Boolean((window.history.state as Record<string, unknown> | null)?.[GUARD_KEY]);

const pushGuardEntry = () =>
  window.history.pushState({ ...window.history.state, [GUARD_KEY]: true }, "");

// 폰·브라우저 뒤로가기를 화면의 뒤로가기 버튼과 같은 동작으로 처리
export const useBackGuard = (enabled: boolean, onBack: () => void) => {
  const onBackRef = useRef(onBack);
  const isEnabledRef = useRef(enabled);
  const isReleasingRef = useRef(false);

  // 가드가 꺼진 뒤에도 남아 있는 같은 주소 기록 여부
  const hasStaleGuardRef = useRef(false);

  useEffect(() => {
    onBackRef.current = onBack;
  });

  useEffect(() => {
    isEnabledRef.current = enabled;

    if (enabled) {
      hasStaleGuardRef.current = false;
      // 같은 주소 기록을 하나 더 쌓아 뒤로가기가 이 기록만 지우게 함
      if (!isGuardEntry()) pushGuardEntry();
      return;
    }

    if (isGuardEntry()) hasStaleGuardRef.current = true;
  }, [enabled]);

  useEffect(() => {
    const handlePopState = () => {
      if (isReleasingRef.current) return;

      if (isEnabledRef.current) {
        pushGuardEntry();
        onBackRef.current();
        return;
      }

      // 꺼진 가드 기록을 지나온 경우 한 번 더 뒤로 이동해 실제 이전 화면으로
      if (hasStaleGuardRef.current) {
        hasStaleGuardRef.current = false;
        window.history.back();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 가드 기록을 지운 뒤 실제 이동 실행
  const release = useCallback((afterRelease: () => void) => {
    isEnabledRef.current = false;
    hasStaleGuardRef.current = false;

    if (!isGuardEntry()) {
      afterRelease();
      return;
    }

    isReleasingRef.current = true;

    const handleReleased = () => {
      window.removeEventListener("popstate", handleReleased);
      isReleasingRef.current = false;
      afterRelease();
    };

    window.addEventListener("popstate", handleReleased);
    window.history.back();
  }, []);

  return { release };
};
