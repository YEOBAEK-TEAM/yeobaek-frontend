import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { ReaderPage } from "./paginateReaderText";
import {
  getReaderSelection,
  getReaderTextPoint,
  getReaderSelectionAtPoint,
} from "./readerSelection";
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
  const clickTimer = useRef<number | undefined>(undefined);
  const lastPointerType = useRef("");
  const lastMouseClick = useRef(false);
  const mousePress = useRef<{ x: number; y: number; moved: boolean; selecting: boolean } | null>(
    null,
  );
  const cancelClick = useCallback(() => window.clearTimeout(clickTimer.current), []);
  useEffect(() => cancelClick, [cancelClick, page]);
  const press = useRef<{ x: number; y: number; timer?: number } | null>(null);
  const clearPress = useCallback(() => {
    window.clearTimeout(press.current?.timer);
    press.current = null;
  }, []);
  useEffect(() => clearPress, [clearPress]);
  const pointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    lastPointerType.current = event.pointerType;
    if (
      !active ||
      !event.isPrimary ||
      event.button !== 0 ||
      !(event.target as Element).closest("p")
    )
      return;
    clearPress();
    if (event.pointerType === "mouse") {
      cancelClick();
      mousePress.current = {
        x: event.clientX,
        y: event.clientY,
        moved: false,
        selecting: isSelecting,
      };
      mouseSelecting.current = isSelecting || !!window.getSelection()?.toString();
      // Start a fresh native range instead of dragging the selected text as an
      // HTML drag-and-drop payload. Shift keeps the existing selection anchor.
      if (isSelecting && !event.shiftKey) window.getSelection()?.removeAllRanges();
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
    if (
      mousePress.current &&
      Math.hypot(event.clientX - mousePress.current.x, event.clientY - mousePress.current.y) > 5
    )
      mousePress.current.moved = true;
    const current = press.current;
    if (current && Math.hypot(event.clientX - current.x, event.clientY - current.y) > 10)
      clearPress();
  };
  const finish = useCallback(() => {
    cancelClick();
    mousePress.current = null;
    frozen.current = false;
    mouseSelecting.current = false;
    clearPress();
    setIsSelecting(false);
    setSelection(null);
    setMode("default");
    window.getSelection()?.removeAllRanges();
  }, [clearPress, cancelClick]);
  const activate = (next: SelectionMode) => {
    frozen.current = true;
    setMode(next);
    // The saved source ranges now own the preview, independent of input focus.
    window.getSelection()?.removeAllRanges();
  };
  const openSelection = (next: ReaderSelection, nextMode: SelectionMode = "default") => {
    frozen.current = true;
    setSelection(next);
    setIsSelecting(true);
    setMode(nextMode);
    window.getSelection()?.removeAllRanges();
  };
  const capture = useCallback(() => {
    if (!active || frozen.current || mouseSelecting.current) return;
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
    setSelection((previous) =>
      JSON.stringify(previous) === JSON.stringify(result) ? previous : result,
    );
    setMode("default");
    const rect = range.getBoundingClientRect();
    const origin = article.parentElement?.getBoundingClientRect().top ?? 0;
    setAnchor({ top: rect.top - origin, bottom: rect.bottom - origin });
  }, [active, page.fragments, articleRef, menuRef]);
  useEffect(() => {
    if (!active) return;
    const outside = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      if (event.pointerType === "mouse") {
        cancelClick();
        const article = articleRef.current;
        if (!article || !getReaderTextPoint(article, event.clientX, event.clientY)) {
          finish();
          return;
        }
        frozen.current = false;
        return;
      }
      // Do not clear the browser's range here: this event may start a new drag.
      frozen.current = false;
      if (!articleRef.current?.contains(event.target as Node)) setIsSelecting(false);
      setSelection(null);
      setMode("default");
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    const releaseOutside = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || articleRef.current?.contains(event.target as Node))
        return;
      const selecting = mouseSelecting.current;
      mousePress.current = null;
      mouseSelecting.current = false;
      if (selecting) capture();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("pointerup", releaseOutside);
    document.addEventListener("selectionchange", capture);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("pointerup", releaseOutside);
      document.removeEventListener("selectionchange", capture);
      document.removeEventListener("keydown", escape);
    };
  }, [active, capture, finish, menuRef, articleRef, cancelClick]);
  useEffect(() => {
    if (mode !== "word") return;
    // Brief active-button feedback, then close the completed action's menu.
    const timer = window.setTimeout(finish, 650);
    return () => window.clearTimeout(timer);
  }, [mode, finish]);
  const pointerUp = (
    event?: ReactPointerEvent<HTMLElement>,
    onSingle?: (next: ReaderSelection) => void,
  ) => {
    if (event?.pointerType === "mouse") {
      const current = mousePress.current;
      mousePress.current = null;
      if (!current) return;
      const moved =
        current.moved || Math.hypot(event.clientX - current.x, event.clientY - current.y) > 5;
      lastMouseClick.current = !moved;
      if (!moved && !current.selecting && articleRef.current) {
        const point = getReaderTextPoint(articleRef.current, event.clientX, event.clientY);
        if (point)
          clickTimer.current = window.setTimeout(() => {
            const next = getReaderSelectionAtPoint(page.fragments, point, false);
            if (!next) return;
            frozen.current = false;
            setIsSelecting(true);
            setSelection(next);
            setMode("default");
            onSingle?.(next);
          }, 300);
        return;
      }
      if (!current.selecting) return;
    }
    mouseSelecting.current = false;
    clearPress();
    capture();
    if (!window.getSelection()?.toString() && !frozen.current) setIsSelecting(false);
  };
  const doubleClick = (event: React.MouseEvent<HTMLElement>) => {
    // Touch compatibility mouse events must retain the long-press policy.
    if (lastPointerType.current !== "mouse" || !lastMouseClick.current) return;
    cancelClick();
    event.preventDefault();
    const article = articleRef.current;
    const point = article && getReaderTextPoint(article, event.clientX, event.clientY);
    const next = point && getReaderSelectionAtPoint(page.fragments, point, true);
    if (!next) return;
    frozen.current = false;
    setSelection(next);
    setIsSelecting(true);
    setMode("default");
  };
  const pointerCancel = () => {
    mousePress.current = null;
    mouseSelecting.current = false;
    cancelClick();
    clearPress();
  };
  return {
    selection,
    mode,
    anchor,
    capture,
    activate,
    openSelection,
    finish,
    isSelecting,
    selectionMenuOpen: !!selection,
    pointerDown,
    pointerMove,
    pointerUp,
    doubleClick,
    pointerCancel,
    isMousePointer: () => lastPointerType.current === "mouse",
  };
}
