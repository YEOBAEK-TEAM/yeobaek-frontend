import { useRef } from "react";
import { useWordSearch } from "@/hooks/useWordSearch";
import { useAddVocabulary } from "@/hooks/useAddVocabulary";
import type { ContentTextSelection } from "../utils/contentTextSelection";
import WordMeaningCard from "./WordMeaningCard";

// Mounted only after the user chooses the vocabulary action.
export default function ContentWordMeaningCard({
  selection,
  onClose,
}: {
  selection: ContentTextSelection;
  onClose: () => void;
}) {
  const word = useWordSearch(selection.text, selection.sentenceId);
  const save = useAddVocabulary();
  const saving = useRef(false);
  if (word.isPending)
    return (
      <p className="book-reader__word-card" role="status">
        단어 뜻을 불러오는 중입니다.
      </p>
    );
  if (word.isError)
    return (
      <div className="book-reader__word-card" role="alert">
        <p>단어 뜻을 불러오지 못했습니다.</p>
        <button type="button" disabled={word.isFetching} onClick={() => void word.refetch()}>
          다시 시도
        </button>
      </div>
    );
  return (
    <WordMeaningCard
      text={selection.text}
      apiEntry={word.data}
      saved={save.isSuccess}
      canSave={word.data.senses.length > 0}
      saving={save.isPending}
      saveError={save.isError}
      onComplete={onClose}
      onSave={() => {
        if (saving.current || save.isSuccess) return;
        saving.current = true;
        save.mutate(
          { ...word.data, sentenceId: selection.sentenceId },
          {
            onSettled: () => {
              saving.current = false;
            },
          },
        );
      }}
    />
  );
}
