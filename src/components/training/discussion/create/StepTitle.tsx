type StepTitleProps = {
  title: string;
  description?: string;
};

export default function StepTitle({ title, description }: StepTitleProps) {
  return (
    <div className="px-1">
      <h2 className="text-[22px] font-bold text-[#4F4D4E]">{title}</h2>

      {description && (
        <p className="mt-1.5 text-[14px] font-semibold tracking-[-0.02em] break-keep text-[#A8ABB2]">
          {description}
        </p>
      )}
    </div>
  );
}
