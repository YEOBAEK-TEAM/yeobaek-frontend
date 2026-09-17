// 받침 유무에 따른 조사 선택
export const josa = (word: string, withFinal: string, withoutFinal: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const isHangul = code >= 0 && code <= 11171;

  return isHangul && code % 28 !== 0 ? withFinal : withoutFinal;
};
