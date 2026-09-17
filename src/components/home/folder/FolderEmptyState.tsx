export default function FolderEmptyState({ text }: { text: string }) {
  return (
    <p className="flex h-full items-center justify-center px-6 text-center text-[13px] leading-[22px] whitespace-pre-line text-[#54555A]">
      {text}
    </p>
  );
}
