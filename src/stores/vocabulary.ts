import { create } from "zustand";
import { mockSentences, mockVocabulary } from "@/mocks/vocabulary";
import type { SentenceItem } from "@/types/sentence";
import type { DeleteType, WordItem } from "@/types/vocabulary";

type VocabularyState = {
  words: WordItem[];
  sentences: SentenceItem[];
  activeTab: DeleteType;
  activeInitial: string;
  setTab: (tab: DeleteType) => void;
  setInitial: (initial: string) => void;
  deleteItem: (type: DeleteType, id: number) => void;
  saveMemo: (id: number, memo: string) => void;
};

// Mock repository: replace these actions with API calls when the service is available.
export const useVocabularyStore = create<VocabularyState>((set) => ({
  words: mockVocabulary,
  sentences: mockSentences,
  activeTab: "word",
  activeInitial: "ㄱ",
  setTab: (activeTab) => set({ activeTab }),
  setInitial: (activeInitial) => set({ activeInitial }),
  deleteItem: (type, id) =>
    set((state) =>
      type === "word"
        ? { words: state.words.filter((word) => word.id !== id) }
        : { sentences: state.sentences.filter((sentence) => sentence.id !== id) },
    ),
  saveMemo: (id, memo) =>
    set((state) => ({
      sentences: state.sentences.map((sentence) =>
        sentence.id === id ? { ...sentence, memo: memo.slice(0, 200) } : sentence,
      ),
    })),
}));
