export type WordItem = {
  id: number;
  page: number;
  word: string;
  partOfSpeech: string;
  meaning: string;
  bookTitle: string;
  collectedAt: string;
  relatedWords: string[];
  example: string;
  dictionaryExamples: string[];
  otherMeanings: { meaning: string; partOfSpeech: string }[];
};

export type Vocabulary = WordItem;
export type DeleteType = "word" | "sentence";
export type SentenceItem = {
  id: number;
  content: string;
  bookTitle: string;
  page: number;
  memo: string;
  hasComment: boolean;
  collectedAt: string;
};
