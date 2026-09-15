export type WordDictionaryEntry = {
  word: string;
  partOfSpeech: string;
  currentMeaning: string;
  otherMeanings: string[];
  examples: string[];
};

export const dictionaryMock: Record<string, WordDictionaryEntry> = {
  타다: {
    word: "타다",
    partOfSpeech: "동사",
    currentMeaning: "자전거, 자동차 등 탈것을 이용하거나 올라타는 행위",
    otherMeanings: [
      "무엇을 액체에 섞어 넣다",
      "악기를 연주하다",
      "상이나 돈, 물건을 받다",
      "어떤 조건이나 시간, 기회를 이용하다",
    ],
    examples: ["기차를 타다", "택시를 타고 학교에 가다"],
  },
  별: {
    word: "별",
    partOfSpeech: "명사",
    currentMeaning: "밤하늘에 반짝이는 빛을 내는 천체",
    otherMeanings: ["어떤 분야에서 많은 사람의 사랑을 받는 사람"],
    examples: ["밤하늘의 별을 바라보다", "작은 별에서 온 왕자"],
  },
  여우: {
    word: "여우",
    partOfSpeech: "명사",
    currentMeaning: "뾰족한 주둥이와 긴 꼬리를 가진 갯과의 동물",
    otherMeanings: ["꾀가 많고 영리한 사람을 비유적으로 이르는 말"],
    examples: ["왕자는 여우와 친구가 되었다"],
  },
  장미: {
    word: "장미",
    partOfSpeech: "명사",
    currentMeaning: "줄기에 가시가 있고 향기로운 꽃을 피우는 식물, 또는 그 꽃",
    otherMeanings: [],
    examples: ["정원에 장미 한 송이가 피었다"],
  },
};

const aliases: Record<string, string> = {
  타고: "타다",
  타는: "타다",
  타며: "타다",
  탔다: "타다",
  타서: "타다",
};

export function normalizeDictionaryWord(text: string) {
  return text.trim().replace(/^[\p{P}\s]+|[\p{P}\s]+$/gu, "");
}

export function isDictionaryWord(text: string) {
  return /^[\p{L}\p{M}\p{N}]+(?:['’-][\p{L}\p{M}\p{N}]+)*$/u.test(normalizeDictionaryWord(text));
}

export function getDictionaryEntry(text: string): WordDictionaryEntry {
  const normalized = normalizeDictionaryWord(text);
  const withoutParticle = normalized.replace(
    /(?:에서|에게|으로|은|는|이|가|을|를|의|에|와|과|도)$/u,
    "",
  );
  const key = [normalized, aliases[normalized], withoutParticle].find(
    (word) => word && Object.hasOwn(dictionaryMock, word),
  );
  return key
    ? dictionaryMock[key]
    : {
        word: normalized,
        partOfSpeech: "",
        currentMeaning: "아직 등록된 뜻이 없습니다.",
        otherMeanings: [],
        examples: [],
      };
}
