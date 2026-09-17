import { useEffect, useRef } from "react";
import { READER_BACKGROUNDS, READER_LINE_HEIGHTS } from "../utils/useReaderSettings";
import type { ReaderSettings } from "../utils/useReaderSettings";

export default function ReaderSettingsPanel({
  settings,
  onChange,
  onClose,
}: {
  settings: ReaderSettings;
  onChange: (settings: ReaderSettings) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="reader-settings-title"
      className="fixed inset-x-0 top-auto bottom-0 m-0 mx-auto w-full max-w-[390px] max-h-[90dvh] overflow-y-auto rounded-t-2xl border-0 bg-[#f7f6f1] p-0 text-black backdrop:bg-black/35"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div>
        <header className="flex items-center justify-between border-b-2 border-[#ebe9e1] px-8 py-3">
          <h2 id="reader-settings-title" className="text-base font-semibold">
            읽기 설정
          </h2>
          <button
            autoFocus
            type="button"
            aria-label="읽기 설정 닫기"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div className="px-7 pt-5 pb-[max(22px,env(safe-area-inset-bottom))]">
          <label className="mb-2 block text-sm font-semibold" htmlFor="reader-font-size">
            글자 크기
          </label>
          <div className="flex h-[52px] items-center gap-3 rounded-lg bg-[#fbfbfb] px-3">
            <span className="text-sm font-semibold" aria-hidden="true">
              A
            </span>
            <input
              id="reader-font-size"
              type="range"
              min={14}
              max={22}
              step={1}
              value={settings.fontSize}
              aria-valuetext={`${settings.fontSize}px`}
              onChange={(event) => onChange({ ...settings, fontSize: Number(event.target.value) })}
              className="reader-settings__slider min-w-0 flex-1"
              style={{
                background: `linear-gradient(to right,#595854 ${((settings.fontSize - 14) / 8) * 100}%,#e4e4e4 0)`,
              }}
            />
            <span className="text-xl font-semibold" aria-hidden="true">
              A
            </span>
          </div>
          <fieldset className="mt-3">
            <legend className="mb-2 text-sm font-semibold">줄 간격</legend>
            <div className="grid grid-cols-3">
              {READER_LINE_HEIGHTS.map((height, index) => (
                <button
                  key={height}
                  type="button"
                  aria-label={["넓은 줄 간격", "기본 줄 간격", "좁은 줄 간격"][index]}
                  aria-pressed={settings.lineHeight === height}
                  onClick={() => onChange({ ...settings, lineHeight: height })}
                  className={`flex h-11 items-center justify-center rounded-md border ${settings.lineHeight === height ? "border-[#797c6e] bg-[#cdd0bf]" : "border-[#cccac7] bg-[#ece9e3]"}`}
                >
                  <svg
                    width="24"
                    height="26"
                    viewBox="0 0 24 26"
                    fill="none"
                    stroke="#595854"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <path
                      d={`M4 ${13 - (9 - index * 3)}h16M4 13h16M4 ${13 + (9 - index * 3)}h16`}
                    />
                  </svg>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-3">
            <legend className="text-sm font-semibold">배경색상</legend>
            <div className="flex items-center justify-between px-4 py-3">
              {READER_BACKGROUNDS.map((color, index) => (
                <button
                  key={color}
                  type="button"
                  aria-label={
                    ["화이트 배경", "아이보리 배경", "블랙 배경", "라이트 그레이 배경"][index]
                  }
                  aria-pressed={settings.backgroundColor === color}
                  onClick={() => onChange({ ...settings, backgroundColor: color })}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-[#eae8e1] ${settings.backgroundColor === color ? "outline-2 outline-offset-2 outline-[#c5c5c5]" : ""}`}
                  style={{ background: color, color: color === "#000000" ? "#fff" : "#bfc0c0" }}
                >
                  {settings.backgroundColor === color && (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-2 border-t-2 border-[#ebe9e1] pt-5">
            <legend className="sr-only">폰트</legend>
            <p className="mb-2 text-sm font-semibold" aria-hidden="true">
              폰트
            </p>
            <div className="grid grid-cols-2">
              {(
                [
                  ["batang", "바탕체"],
                  ["nanum", "나눔명조"],
                ] as const
              ).map(([font, label]) => (
                <button
                  key={font}
                  type="button"
                  aria-pressed={settings.fontFamily === font}
                  onClick={() => onChange({ ...settings, fontFamily: font })}
                  title={
                    font === "nanum" ? "설치된 나눔명조 사용, 없으면 시스템 명조체 사용" : undefined
                  }
                  className={`h-11 rounded-md border text-sm [font-family:serif] ${settings.fontFamily === font ? "border-[#797c6e] bg-[#cdd0bf]" : "border-[#cccac7] bg-[#e7e7e7]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </dialog>
  );
}
