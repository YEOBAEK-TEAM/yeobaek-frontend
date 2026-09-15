import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import type { ReaderPage } from "../utils/paginateReaderText";

export type DeckPage = ReaderPage | { id: "cover"; pdfPage?: undefined; start?: undefined };

type Props = {
  pages: DeckPage[];
  index: number;
  onNavigate: (index: number) => void;
  renderPage: (
    page: DeckPage,
    active: boolean,
    onSwipeDisabledChange: (disabled: boolean) => void,
  ) => ReactNode;
};
type Gesture = { id: number; x: number; y: number; time: number; width: number; dragging: boolean };
const hasSelection = () => Boolean(window.getSelection()?.toString());

export default function ReaderPageDeck({ pages, index, onNavigate, renderPage }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const [motion, setMotion] = useState({ delta: 0, settling: false, dragging: false });
  const swipeDisabled = useRef(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const onSwipeDisabledChange = useCallback((disabled: boolean) => {
    swipeDisabled.current = disabled;
    setSelectionMode(disabled);
    if (disabled) {
      gesture.current = null;
      window.clearTimeout(timer.current);
      setMotion({ delta: 0, settling: false, dragging: false });
    }
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const blocked = () =>
    swipeDisabled.current ||
    hasSelection() ||
    Boolean(viewport.current?.querySelector(".book-reader__selection"));
  const settle = (direction: number, width: number) => {
    gesture.current = null;
    setMotion({ delta: -direction * width, settling: true, dragging: false });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (direction && !blocked()) onNavigate(index + direction);
      setMotion({ delta: 0, settling: false, dragging: false });
    }, 260);
  };
  const cancel = () => {
    if (gesture.current) settle(0, gesture.current.width);
  };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) {
      cancel();
      return;
    }
    if (event.button !== 0 || motion.settling || blocked()) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, input, a, textarea, .book-reader__selection")) return;
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
      width: event.currentTarget.clientWidth,
      dragging: false,
    };
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    if (blocked()) {
      cancel();
      return;
    }
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.dragging) {
      // Leave stationary/long presses and vertical gestures to native selection.
      if (
        (event.pointerType !== "mouse" && performance.now() - current.time >= 400) ||
        Math.abs(dy) > Math.abs(dx) + 8
      ) {
        gesture.current = null;
        return;
      }
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
      current.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const atEdge = (index === 0 && dx > 0) || (index === pages.length - 1 && dx < 0);
    const delta = Math.max(-current.width, Math.min(current.width, dx)) * (atEdge ? 0.22 : 1);
    setMotion({ delta, settling: false, dragging: true });
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    if (!current.dragging) {
      gesture.current = null;
      return;
    }
    const dx = event.clientX - current.x;
    const threshold = 90;
    let direction = !blocked() && Math.abs(dx) >= threshold ? (dx < 0 ? 1 : -1) : 0;
    if (index + direction < 0 || index + direction >= pages.length) direction = 0;
    settle(direction, current.width);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return (
    <div
      ref={viewport}
      className={`book-reader__viewport${selectionMode ? " is-selection-mode" : ""}${motion.dragging ? " is-dragging" : ""}`}
      role="region"
      aria-label="전자책 본문. 좌우 드래그로 페이지 이동, 클릭으로 문장 선택, 더블클릭으로 단어 선택"
      tabIndex={0}
      onPointerDownCapture={down}
      onMouseDownCapture={(event) => {
        if (
          event.button !== 0 ||
          (event.target as Element).closest("button, input, a, textarea, .book-reader__selection")
        )
          return;
        // Suppress native text dragging only in the default page-navigation mode.
        if (!blocked()) event.preventDefault();
      }}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={cancel}
      onLostPointerCapture={(event) => {
        // Touch initially captures the text node's element. Moving capture to
        // this viewport bubbles its loss event; that is not a cancelled swipe.
        if (event.target === event.currentTarget) cancel();
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget || motion.settling || blocked()) return;
        const direction = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
        if (direction && index + direction >= 0 && index + direction < pages.length) {
          event.preventDefault();
          settle(direction, event.currentTarget.clientWidth);
        }
      }}
    >
      <div
        className="book-reader__track"
        style={{
          transform: `translate3d(calc(-100% + ${motion.delta}px), 0, 0)`,
          transition: motion.settling ? "transform 260ms cubic-bezier(.22,.61,.36,1)" : "none",
        }}
      >
        {/* The callback is passed to the reader and invoked by its effect, never during render. */}
        {/* eslint-disable react-hooks/refs */}
        {[-1, 0, 1].map((offset) => {
          const page = pages[index + offset];
          return (
            <section
              key={offset}
              className="book-reader__slide"
              inert={offset !== 0}
              aria-hidden={offset !== 0}
              data-reader-page={page ? index + offset + 1 : undefined}
              data-pdf-page={page?.pdfPage}
              data-source-start={page?.start}
            >
              {page && renderPage(page, offset === 0, onSwipeDisabledChange)}
            </section>
          );
        })}
        {/* eslint-enable react-hooks/refs */}
      </div>
    </div>
  );
}
