import type { RefObject } from "react";
import { useLayoutEffect } from "react";

type Props = {
  menuRef: RefObject<HTMLDivElement | null>;
  left: number;
  top: number;
  onChangeColor: () => void;
  onNote: () => void;
  onDelete: () => void;
};

export default function CollectedSentenceMenu({
  menuRef,
  left,
  top,
  onChangeColor,
  onNote,
  onDelete,
}: Props) {
  useLayoutEffect(() => {
    const menu = menuRef.current;
    const parent = menu?.parentElement;
    if (!menu || !parent) return;
    const position = () => {
      const half = menu.offsetWidth / 2;
      menu.style.left = `${Math.max(half, Math.min(parent.clientWidth - half, left))}px`;
      menu.style.top = `${Math.max(4, Math.min(parent.clientHeight - menu.offsetHeight - 4, top + 36 - menu.offsetHeight))}px`;
    };
    const observer = new ResizeObserver(position);
    observer.observe(menu);
    position();
    return () => observer.disconnect();
  }, [menuRef, left, top]);
  return (
    <div
      ref={menuRef}
      className="book-reader__selection book-reader__collected"
      style={{ left: left, top: top }}
      onPointerDown={(event) => event.preventDefault()}
    >
      <div className="book-reader__collected-actions" role="group" aria-label="수집한 문장 관리">
        <button type="button" onClick={onChangeColor}>
          색 변경
        </button>
        <button type="button" onClick={onNote}>
          노트꺼내기
        </button>
        <button type="button" onClick={onDelete}>
          삭제
        </button>
      </div>
    </div>
  );
}
