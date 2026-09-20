import correctCharacter from "@/assets/images/books/question/correctCharacter.png";
import CompletionLayout from "@/components/common/completion/CompletionLayout";
import ReflectionPromptCard from "@/components/library/unlock-quiz/ReflectionPromptCard";
import { REFLECTION_PROMPTS, UNLOCK_SUCCESS } from "@/constants/library/unlockQuiz";

type UnlockSuccessViewProps = {
  bookTitle: string;
  onLater: () => void;
  onWrite: () => void;
};

export default function UnlockSuccessView({ bookTitle, onLater, onWrite }: UnlockSuccessViewProps) {
  return (
    <CompletionLayout
      character={correctCharacter}
      title={UNLOCK_SUCCESS.getTitle(bookTitle)}
      description={UNLOCK_SUCCESS.getDescription(bookTitle)}
      characterClassName="h-50"
      topClassName="pt-20"
      celebrate
      footer={
        <div className="grid grid-cols-2 gap-4 pb-8">
          <button
            type="button"
            onClick={onLater}
            className="h-16 rounded-xl border-[1.5px] border-[#8E8A7E] bg-white text-[17px] font-bold text-[#6B6340]"
          >
            {UNLOCK_SUCCESS.laterLabel}
          </button>
          <button
            type="button"
            onClick={onWrite}
            className="h-16 rounded-xl bg-[#B8BC9F] text-[17px] font-bold text-white"
          >
            {UNLOCK_SUCCESS.writeLabel}
          </button>
        </div>
      }
    >
      <ul className="mt-6 flex flex-col gap-3">
        {REFLECTION_PROMPTS.map((prompt) => (
          <ReflectionPromptCard key={prompt.id} icon={prompt.icon} text={prompt.text} />
        ))}
      </ul>
    </CompletionLayout>
  );
}
