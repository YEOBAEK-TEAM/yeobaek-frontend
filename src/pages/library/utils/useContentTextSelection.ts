import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { contentWordRange, getContentTextSelection, sentenceElement } from "./contentTextSelection";
import type { ContentTextSelection } from "./contentTextSelection";

export function useContentTextSelection(
  active: boolean,
  onSwipeDisabledChange: (disabled: boolean) => void,
) {
  const articleRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<ContentTextSelection | null>(null);
  const [wordSelection, setWordSelection] = useState<ContentTextSelection | null>(null);
  const [nativeSelection, setNativeSelection] = useState(false);
  const nativeEnabled = useRef(false);
  const frozen = useRef(false);
  const press = useRef<{
    id: number;
    x: number;
    y: number;
    moved: boolean;
    sentence: HTMLElement;
  } | null>(null);
  const lastTap = useRef<{ time: number; x: number; y: number; sentence: HTMLElement } | null>(
    null,
  );
  const clickTimer = useRef<number | undefined>(undefined);
  const touchTimer = useRef<number | undefined>(undefined);
  const selectionTimer = useRef<number | undefined>(undefined);

  const selectRange = useCallback(
    (range: Range) => {
      const root = articleRef.current;
      if (!root) return;
      const next = getContentTextSelection(root, range);
      if (!next) return;
      nativeEnabled.current = true;
      setNativeSelection(true);
      root.dataset.nativeSelection = "true";
      setSelection(next);
      onSwipeDisabledChange(true);
      // Enter selection mode before applying the range so it stays editable.
      const native = window.getSelection();
      native?.removeAllRanges();
      native?.addRange(range);
    },
    [onSwipeDisabledChange],
  );

  const capture = useCallback(() => {
    if (!active || !nativeEnabled.current || frozen.current || !articleRef.current || press.current)
      return;
    const native = window.getSelection();
    const range = native?.rangeCount ? native.getRangeAt(0) : null;
    if (!range || native?.isCollapsed) {
      nativeEnabled.current = false;
      setNativeSelection(false);
      setSelection(null);
      onSwipeDisabledChange(false);
      return;
    }
    const next = range && getContentTextSelection(articleRef.current, range);
    setSelection((previous) =>
      previous?.text === next?.text && previous?.sentenceId === next?.sentenceId ? previous : next,
    );
    // Cross-sentence ranges cannot be saved, but remain in native selection mode.
    onSwipeDisabledChange(true);
  }, [active, onSwipeDisabledChange]);

  const close = useCallback(() => {
    window.clearTimeout(clickTimer.current);
    window.clearTimeout(touchTimer.current);
    window.clearTimeout(selectionTimer.current);
    frozen.current = false;
    nativeEnabled.current = false;
    press.current = null;
    lastTap.current = null;
    setNativeSelection(false);
    setSelection(null);
    setWordSelection(null);
    const native = window.getSelection();
    if (native?.anchorNode && articleRef.current?.contains(native.anchorNode))
      native.removeAllRanges();
    onSwipeDisabledChange(false);
  }, [onSwipeDisabledChange]);

  useEffect(() => {
    if (!active) return;
    const change = () => {
      if (!nativeEnabled.current || frozen.current) return;
      window.clearTimeout(selectionTimer.current);
      selectionTimer.current = window.setTimeout(capture, 180);
    };
    const outside = (event: globalThis.PointerEvent) => {
      if (!articleRef.current?.contains(event.target as Node)) close();
    };
    const release = (event: globalThis.PointerEvent) => {
      const current = press.current;
      if (!current || current.id !== event.pointerId) return;
      press.current = null;
      window.clearTimeout(touchTimer.current);
      if (nativeEnabled.current) {
        capture();
        return;
      }
      if (current.moved || Math.hypot(event.clientX - current.x, event.clientY - current.y) > 5) {
        lastTap.current = null;
        return;
      }
      const previous = lastTap.current;
      const now = performance.now();
      if (
        previous &&
        now - previous.time < 320 &&
        previous.sentence === current.sentence &&
        Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 24
      ) {
        lastTap.current = null;
        window.clearTimeout(clickTimer.current);
        const range =
          articleRef.current && contentWordRange(articleRef.current, event.clientX, event.clientY);
        if (range) selectRange(range);
      } else {
        lastTap.current = {
          time: now,
          x: event.clientX,
          y: event.clientY,
          sentence: current.sentence,
        };
        clickTimer.current = window.setTimeout(() => {
          const range = document.createRange();
          range.selectNodeContents(current.sentence);
          selectRange(range);
        }, 320);
      }
    };
    const cancel = () => {
      window.clearTimeout(touchTimer.current);
      press.current = null;
      if (nativeEnabled.current) capture();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("selectionchange", change);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("pointerup", release);
    document.addEventListener("pointercancel", cancel);
    document.addEventListener("keydown", escape);
    const root = articleRef.current;
    return () => {
      document.removeEventListener("selectionchange", change);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", cancel);
      document.removeEventListener("keydown", escape);
      window.clearTimeout(clickTimer.current);
      window.clearTimeout(touchTimer.current);
      window.clearTimeout(selectionTimer.current);
      const native = window.getSelection();
      if (native?.anchorNode && root?.contains(native.anchorNode)) native.removeAllRanges();
      onSwipeDisabledChange(false);
    };
  }, [active, capture, close, selectRange, onSwipeDisabledChange]);

  return {
    articleRef,
    menuRef,
    selection,
    wordSelection,
    nativeSelection,
    close,
    openWord: () => {
      if (!selection) return;
      frozen.current = true;
      setWordSelection(selection);
      onSwipeDisabledChange(true);
    },
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (!active || !event.isPrimary || event.button !== 0) return;
      const sentence = sentenceElement(event.currentTarget, event.target as Node);
      if (!sentence) return;
      window.clearTimeout(clickTimer.current);
      window.clearTimeout(touchTimer.current);
      frozen.current = false;
      setWordSelection(null);
      const { pointerId: id, clientX: x, clientY: y } = event;
      press.current = { id, x, y, moved: false, sentence };
      if (nativeEnabled.current) {
        // Start a fresh range rather than HTML drag-and-drop of selected text.
        // Touch handles and Shift+click keep their native selection anchor.
        if (event.pointerType === "mouse" && !event.shiftKey)
          window.getSelection()?.removeAllRanges();
        return;
      }
      // Default presses belong to the deck. Only a stationary touch enables handles.
      if (event.pointerType !== "mouse")
        touchTimer.current = window.setTimeout(() => {
          nativeEnabled.current = true;
          setNativeSelection(true);
          lastTap.current = null;
          onSwipeDisabledChange(true);
          // Apply before the browser's long-press recognition, without cancelling touch.
          if (articleRef.current) articleRef.current.dataset.nativeSelection = "true";
          const range = articleRef.current && contentWordRange(articleRef.current, x, y);
          if (range) selectRange(range);
        }, 400);
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (
        press.current &&
        Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y) > 5
      ) {
        press.current.moved = true;
        window.clearTimeout(touchTimer.current);
      }
    },
  };
}
