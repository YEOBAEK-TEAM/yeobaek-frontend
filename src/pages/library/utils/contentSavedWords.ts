export const normalizeSavedWord = (word: string) =>
  // Dictionary headwords may include punctuation absent from the printed text (뒷-마당).
  word.normalize("NFC").replace(/\p{P}/gu, "").trim().toLocaleLowerCase();

export type SavedWordRange = { start: number; end: number; word: string };

// Match whole words, optionally followed by a Korean particle, never arbitrary substrings.
const particle =
  /^(은|는|이|가|을|를|의|에|에서|에게|께|한테|으로|로|와|과|도|만|부터|까지|처럼|보다|랑|이랑|하고|에서는|에는|에도|에게는|으로는|로는)$/;
export function savedWordRanges(text: string, words: ReadonlySet<string>): SavedWordRange[] {
  const ranges: SavedWordRange[] = [];
  for (const part of new Intl.Segmenter("ko", { granularity: "word" }).segment(text)) {
    if (!part.isWordLike) continue;
    for (let length = part.segment.length; length > 0; length--) {
      const word = normalizeSavedWord(part.segment.slice(0, length));
      const suffix = part.segment.slice(length);
      if (words.has(word) && (!suffix || particle.test(suffix))) {
        ranges.push({ start: part.index, end: part.index + length, word });
        break;
      }
    }
  }
  return ranges;
}
