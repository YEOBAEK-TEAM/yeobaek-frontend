// 단어 상세용
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
  otherMeanings: {
    meaning: string;
    partOfSpeech: string;
  }[];
};

// 단어 목록 UI용
export type WordListItem = {
  id: number;
  page: number;
  word: string;
  meaning: string;
  bookTitle: string;
  collectedAt: string;
};

export type Vocabulary = WordItem;

// 단어/문장 삭제 타입
export type DeleteType = "word" | "sentence";

// 단어장 목록 API 응답 항목
export type VocabularyListItemResponse = {
  vocabularyId: number;
  word: string;
  meaning: string;
  bookId: number;
  bookTitle: string;
  pageId: number;
  pageNumber: number;
  createdAt: string;
};

// 단어장 목록 API 응답
export type VocabularyListResponse = {
  items: VocabularyListItemResponse[];
  page: number;
  hasNext: boolean;
  totalCount: number;
};

// 단어 뜻 하나
export type WordSenseResponse = {
  order: number;
  definition: string;
  examples: string[];
};

export type WordSearchResponse = {
  targetCode: string;
  word: string;
  pos: string;
  senses: WordSenseResponse[];
};

export type AddVocabularyRequest = WordSearchResponse & { sentenceId: number };

// 단어 상세 API 응답
export type VocabularyDetailResponse = {
  vocabularyId: number;
  word: string;
  pos: string;
  senses: WordSenseResponse[];
  bookId: number;
  bookTitle: string;
  pageId: number;
  pageNumber: number;
  sentenceId: number;
  createdAt: string;
};
