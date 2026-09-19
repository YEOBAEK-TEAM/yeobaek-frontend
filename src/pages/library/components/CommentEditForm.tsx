const editButtonClass =
  "min-h-7 rounded border border-[#909090] bg-transparent text-[#F7F6F1] active:text-white";
const saveButtonClass = `${editButtonClass} active:bg-[#777777]`;
const cancelButtonClass = `${editButtonClass} active:bg-[#493d3c]`;

type Props = {
  value: string;
  label: string;
  pending?: boolean;
  onChange: (value: string) => void;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
};
export default function CommentEditForm({
  value,
  label,
  pending,
  onChange,
  onSave,
  onCancel,
}: Props) {
  return (
    <form
      className="mt-2"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!value.trim() || value.length > 200 || pending) return;
        await onSave();
      }}
    >
      <div className="bg-[#606060] px-2 pt-2 pb-1">
        <textarea
          autoFocus
          aria-label={label}
          className="min-h-16 w-full resize-y bg-transparent text-sm leading-5 outline-none"
          maxLength={200}
          value={value}
          readOnly={pending}
          onChange={(event) => onChange(event.target.value)}
        />

        <div className="text-right text-[10px] text-[#A3A3A3]" aria-live="polite">
          {value.length}/200
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <button
          type="submit"
          disabled={pending || !value.trim() || value.length > 200}
          className={saveButtonClass}
        >
          수정완료
        </button>

        <button type="button" className={cancelButtonClass} onClick={onCancel}>
          취소하기
        </button>
      </div>
    </form>
  );
}
