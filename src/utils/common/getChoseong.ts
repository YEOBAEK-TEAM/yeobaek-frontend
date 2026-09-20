// 한글 음절에서 뽑아낼 수 있는 초성 19자, 필터 순서도 이 배열을 따름
export const CHOSEONG_LIST = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const FIRST_SYLLABLE = 0xac00;
const LAST_SYLLABLE = 0xd7a3;

// 음절 하나가 중성·종성 조합 588개를 차지
const SYLLABLES_PER_CHOSEONG = 588;

// 따옴표나 숫자로 시작할 수 있어 첫 한글 글자를 기준으로 판단
export const getChoseong = (text: string): string | null => {
  for (const character of text) {
    const code = character.codePointAt(0);
    if (code === undefined || code < FIRST_SYLLABLE || code > LAST_SYLLABLE) continue;

    return CHOSEONG_LIST[Math.floor((code - FIRST_SYLLABLE) / SYLLABLES_PER_CHOSEONG)];
  }

  return null;
};
