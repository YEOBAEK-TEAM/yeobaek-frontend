import BMDOHYEON from "@/assets/fonts/BMDOHYEON.ttf";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <>
      <style>
        {`
          @font-face {
            font-family: "BMDOHYEON";
            src: url("${BMDOHYEON}") format("truetype");
            font-weight: 400;
            font-style: normal;
          }
        `}
      </style>

      <div className="flex items-center justify-between px-5">
        <h2 className="text-[20px] text-[#4F4D4E]" style={{ fontFamily: "BMDOHYEON" }}>
          {title}
        </h2>

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="text-[14px] font-semibold text-[#4F4D4E]"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </>
  );
}
