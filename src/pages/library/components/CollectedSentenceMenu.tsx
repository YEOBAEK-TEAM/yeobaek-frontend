import type { RefObject } from "react";
import { useLayoutEffect } from "react";

type Props = {
  menuRef: RefObject<HTMLDivElement | null>;
  left: number;
  top: number;
  highlightId: string;
  activeMode: "color" | "note";
  onChangeColor: () => void;
  onNote: () => void;
  onDelete: () => void;
};

export default function CollectedSentenceMenu({
  menuRef,
  left,
  top,
  highlightId,
  activeMode,
  onChangeColor,
  onNote,
  onDelete,
}: Props) {
  useLayoutEffect(() => {
    const menu = menuRef.current;
    const parent = menu?.parentElement;
    if (!menu || !parent) return;
    const position = () => {
      const rects = [...parent.querySelectorAll<HTMLElement>("[data-highlight-id]")]
        .filter((mark) => mark.dataset.highlightId === highlightId)
        .flatMap((mark) => [...mark.getClientRects()]);
      const origin = parent.getBoundingClientRect();
      const anchorLeft = rects.length
        ? (Math.min(...rects.map((rect) => rect.left)) +
            Math.max(...rects.map((rect) => rect.right))) /
            2 -
          origin.left
        : left;
      const anchorTop = rects.length
        ? Math.min(...rects.map((rect) => rect.top)) - origin.top
        : top;
      const halfWidth = menu.offsetWidth / 2;
      const gap = 8;
      const edge = 4;
      const menuLeft = Math.max(
        halfWidth + edge,
        Math.min(parent.clientWidth - halfWidth - edge, anchorLeft),
      );
      const menuTop = Math.max(
        edge,
        Math.min(
          parent.clientHeight - menu.offsetHeight - edge,
          anchorTop - menu.offsetHeight - gap,
        ),
      );
      menu.style.left = `${menuLeft}px`;
      menu.style.top = `${menuTop + parent.scrollTop}px`;
    };
    const observer = new ResizeObserver(position);
    observer.observe(menu);
    observer.observe(parent);
    const article = parent.querySelector("article");
    if (article) observer.observe(article);
    parent.addEventListener("scroll", position);
    position();
    return () => {
      observer.disconnect();
      parent.removeEventListener("scroll", position);
    };
  }, [menuRef, left, top, highlightId, activeMode]);
  return (
    <div
      ref={menuRef}
      className="book-reader__selection book-reader__collected"
      style={{ left: left, top: top }}
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div className="book-reader__collected-actions" role="group" aria-label="수집한 문장 관리">
        <button
          type="button"
          className={activeMode === "color" ? "is-active" : undefined}
          aria-pressed={activeMode === "color"}
          onClick={onChangeColor}
        >
          색 변경
        </button>
        <button
          type="button"
          className={activeMode === "note" ? "is-active" : undefined}
          aria-pressed={activeMode === "note"}
          onClick={onNote}
        >
          노트꺼내기
        </button>
        <button type="button" onClick={onDelete}>
          삭제
        </button>
      </div>
    </div>
  );
}
