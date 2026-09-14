import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { ReaderPage } from "./paginateReaderText";
import { getReaderSelection } from "./readerSelection";
import type { ReaderSelection } from "./readerSelection";

export type SelectionMode = "default" | "highlight" | "word" | "comment";

export function useTextSelection(
  page: ReaderPage,
  active: boolean,
  articleRef: RefObject<HTMLElement | null>,
  menuRef: RefObject<HTMLDivElement | null>,
) {
  const [selection, setSelection] = useState<ReaderSelection | null>(null);
  const [mode, setMode] = useState<SelectionMode>("default");
  const [anchor, setAnchor] = useState({ top: 0, bottom: 0 });
  const frozen = useRef(false);
  const mouseSelecting = useRef(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const press = useRef<{ x: number; y: number; timer?: number } | null>(null);
  const clearPress = useCallback(() => {
    window.clearTimeout(press.current?.timer);
    press.current = null;
  }, []);
  useEffect(() => clearPress, [clearPress]);
  const pointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      !active ||
      !event.isPrimary ||
      event.button !== 0 ||
      !(event.target as Element).closest("p")
    )
      return;
    clearPress();
    if (event.pointerType === "mouse") {
      mouseSelecting.current = isSelecting || !!window.getSelection()?.toString();
      return;
    }
    press.current = {
      x: event.clientX,
      y: event.clientY,
      timer: window.setTimeout(() => setIsSelecting(true), 400),
    };
    // Preserve native long-press selection and draggable selection handles.
  };
  const pointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const current = press.current;
    if (current && Math.hypot(event.clientX - current.x, event.clientY - current.y) > 10)
      clearPress();
  };
  const finish = useCallback(() => {
    frozen.current = false;
    mouseSelecting.current = false;
    clearPress();
    setIsSelecting(false);
    setSelection(null);
    setMode("default");
    window.getSelection()?.removeAllRanges();
  }, [clearPress]);
  const activate = (next: SelectionMode) => {
    frozen.current = true;
    setMode(next);
    // The saved source ranges now own the preview, independent of input focus.
    window.getSelection()?.removeAllRanges();
  };
  const capture = useCallback(() => {
    if (!active || frozen.current) return;
    const selected = window.getSelection();
    const article = articleRef.current;
    if (!article) return;
    if (!selected || selected.isCollapsed || !selected.rangeCount) {
      if (!menuRef.current?.contains(document.activeElement)) {
        if (!mouseSelecting.current) setIsSelecting(false);
        setSelection(null);
        setMode("default");
      }
      return;
    }
    const range = selected.getRangeAt(0);
    if (!article.contains(range.startContainer) || !article.contains(range.endContainer)) return;
    const result = getReaderSelection(article, range, page.fragments);
    if (!result.text.trim() || !result.ranges.length) return;
    setIsSelecting(true);
    setSelection(result);
    setMode("default");
    const rect = range.getBoundingClientRect();
    const origin = article.parentElement?.getBoundingClientRect().top ?? 0;
    setAnchor({ top: rect.top - origin, bottom: rect.bottom - origin });
  }, [active, page.fragments, articleRef, menuRef]);
  useEffect(() => {
    if (!active) return;
    const outside = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      // Do not clear the browser's range here: this event may start a new drag.
      frozen.current = false;
      if (!articleRef.current?.contains(event.target as Node)) setIsSelecting(false);
      setSelection(null);
      setMode("default");
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("selectionchange", capture);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("selectionchange", capture);
      document.removeEventListener("keydown", escape);
    };
  }, [active, capture, finish, menuRef, articleRef]);
  useEffect(() => {
    if (mode !== "word") return;
    // Brief active-button feedback, then close the completed action's menu.
    const timer = window.setTimeout(finish, 650);
    return () => window.clearTimeout(timer);
  }, [mode, finish]);
  const pointerUp = () => {
    mouseSelecting.current = false;
    clearPress();
    capture();
    if (!window.getSelection()?.toString() && !frozen.current) setIsSelecting(false);
  };
  return {
    selection,
    mode,
    anchor,
    capture,
    activate,
    finish,
    isSelecting,
    selectionMenuOpen: !!selection,
    pointerDown,
    pointerMove,
    pointerUp,
  };
}
