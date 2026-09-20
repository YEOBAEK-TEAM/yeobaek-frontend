import { useSheetSlideIn } from "@/hooks/common/useSheetSlideIn";
import type { ReadingDay } from "@/types/my";
import { dayPages } from "../myUtils";
export default function ReadingRecordSheet({
  day,
  onClose,
}: {
  day: ReadingDay;
  onClose: () => void;
}) {
  const { dialogRef, sheetStyle, backdropClassName, requestClose } = useSheetSlideIn(onClose, {
    lockScroll: true,
  });
  const date = new Date(`${day.date}T12:00:00`);
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="reading-day-title"
      style={sheetStyle}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientY < bounds.top ||
            event.clientX < bounds.left ||
            event.clientX > bounds.right
          )
            requestClose();
        }
      }}
      className={`fixed inset-x-0 top-auto bottom-0 mx-auto max-h-[75dvh] w-full max-w-97.5 overflow-y-auto rounded-t-3xl border-0 bg-[#FFFEFB] p-0 text-[#30201D] ${backdropClassName}`}
    >
      <div className="mx-auto mt-5 h-2 w-24 rounded-full bg-[#E5E1DC]" />
      <div className="flex items-center justify-between px-7 py-5">
        <h2 id="reading-day-title" className="text-lg font-bold">
          {date.getMonth() + 1}월 {date.getDate()}일 ({"일월화수목금토"[date.getDay()]})
        </h2>
        <span className="text-sm font-semibold">{dayPages(day)}p 읽었어요</span>
      </div>
      <ul>
        {day.sessions.map((session) => (
          <li
            key={session.id}
            className="flex items-center gap-5 border-t border-[#EAE7E1] px-8 py-4"
          >
            <img src={session.coverUrl} alt="" className="h-22 w-15 object-cover" />
            <div>
              <h3 className="text-base font-bold text-black">{session.bookTitle}</h3>
              <p className="text-base font-semibold text-[#808080]">
                p.{session.page} - {session.endPage}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
