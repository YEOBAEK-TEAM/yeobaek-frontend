export type WordDictionaryEntry = {
  word: string;
  partOfSpeech: string;
  currentMeaning: string;
  otherMeanings: string[];
  examples: string[];
};

export const dictionaryMock: Record<string, WordDictionaryEntry> = {
  맹수: {
    word: "맹수",
    partOfSpeech: "명사",
    currentMeaning: "성질이 사납고 육식을 하는 짐승",
    otherMeanings: [],
    examples: ["숲에서 맹수를 만났다."],
  },
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

// Explicit suffixes keep compound-particle handling bounded; do not repeatedly
// strip syllables, which could consume part of the noun itself.
const nounParticles = [
  "은",
  "는",
  "이",
  "가",
  "을",
  "를",
  "의",
  "에",
  "에서",
  "에게",
  "에게서",
  "한테",
  "한테서",
  "께",
  "께서",
  "로",
  "으로",
  "와",
  "과",
  "하고",
  "랑",
  "이랑",
  "도",
  "만",
  "뿐",
  "밖에",
  "부터",
  "까지",
  "보다",
  "처럼",
  "만큼",
  "마다",
  "조차",
  "마저",
  "이나",
  "나",
  "이든",
  "든",
  "이든지",
  "든지",
  "이라도",
  "라도",
  "이야",
  "야",
  "로서",
  "으로서",
  "로써",
  "으로써",
  "로부터",
  "으로부터",
  "에는",
  "에도",
  "에만",
  "에서는",
  "에서도",
  "에서만",
  "에서부터",
  "에게는",
  "에게도",
  "에게만",
  "에게서는",
  "에게서도",
  "에게서부터",
  "한테는",
  "한테도",
  "한테만",
  "한테서는",
  "한테서도",
  "께는",
  "께도",
  "로는",
  "로도",
  "로만",
  "으로는",
  "으로도",
  "으로만",
  "와는",
  "와도",
  "과는",
  "과도",
  "하고는",
  "하고도",
  "랑은",
  "랑도",
  "이랑은",
  "이랑도",
  "부터는",
  "부터도",
  "부터만",
  "까지는",
  "까지도",
  "까지만",
  "만은",
  "만도",
  "만을",
  "만이",
  "만의",
  "뿐만",
  "뿐만은",
  "뿐만도",
  "보다는",
  "보다도",
  "처럼은",
  "처럼도",
  "만큼은",
  "만큼도",
  "조차도",
  "마저도",
  "로부터는",
  "로부터도",
  "으로부터는",
  "으로부터도",
].sort((a, b) => b.length - a.length);

// Keep exact dictionary words and verb forms intact. Only a known noun can
// justify shortening a selection; unknown words retain their original offsets.
export function stripKnownNounParticle(word: string) {
  if (Object.hasOwn(dictionaryMock, word) || Object.hasOwn(aliases, word)) return word;
  for (const particle of nounParticles) {
    if (!word.endsWith(particle)) continue;
    const candidate = word.slice(0, -particle.length);
    if (
      Object.hasOwn(dictionaryMock, candidate) &&
      dictionaryMock[candidate].partOfSpeech === "명사"
    )
      return candidate;
  }
  return word;
}

export function getDictionaryEntry(text: string): WordDictionaryEntry {
  const normalized = normalizeDictionaryWord(text);
  const withoutParticle = stripKnownNounParticle(normalized);
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
