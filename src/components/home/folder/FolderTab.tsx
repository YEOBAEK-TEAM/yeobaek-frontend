type FolderTabProps = {
  id: string;
  label: string;
  controls: string;
  active: boolean;
  className: string;
  height: string;
  onSelect: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

// 폴더 탭 클릭 영역
export default function FolderTab({
  id,
  label,
  controls,
  active,
  className,
  height,
  onSelect,
  onKeyDown,
}: FolderTabProps) {
  return (
    <button
      type="button"
      id={id}
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      style={{ height }}
      className={`absolute top-0 z-30 ${className}`}
    >
      <span className="sr-only">{label}</span>
    </button>
  );
}
