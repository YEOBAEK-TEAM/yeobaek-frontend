import { useState } from "react";

export const READER_FONTS = {
  batang: '"Pretendard Variable", Pretendard, sans-serif',
  nanum: '"NanumMyeongjo", serif',
};
export const READER_BACKGROUNDS = ["#ffffff", "#FFFEFB", "#000000", "#fafafa"];
export const READER_LINE_HEIGHTS = [2.3, 1.95, 1.6];
export type ReaderSettings = {
  fontSize: number;
  lineHeight: number;
  backgroundColor: string;
  fontFamily: keyof typeof READER_FONTS;
};
export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: 16,
  lineHeight: 1.95,
  backgroundColor: "#fffefb",
  fontFamily: "batang",
};
const key = "yeobaek:reader:settings";
export function parseReaderSettings(value: unknown): ReaderSettings {
  const saved = value && typeof value === "object" ? (value as Partial<ReaderSettings>) : {};
  return {
    fontSize:
      typeof saved.fontSize === "number" &&
      Number.isInteger(saved.fontSize) &&
      saved.fontSize >= 14 &&
      saved.fontSize <= 22
        ? saved.fontSize
        : DEFAULT_READER_SETTINGS.fontSize,
    lineHeight: READER_LINE_HEIGHTS.includes(saved.lineHeight ?? 0)
      ? saved.lineHeight!
      : DEFAULT_READER_SETTINGS.lineHeight,
    backgroundColor: READER_BACKGROUNDS.includes(saved.backgroundColor ?? "")
      ? saved.backgroundColor!
      : DEFAULT_READER_SETTINGS.backgroundColor,
    fontFamily:
      saved.fontFamily && Object.hasOwn(READER_FONTS, saved.fontFamily)
        ? saved.fontFamily
        : DEFAULT_READER_SETTINGS.fontFamily,
  };
}
export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      return parseReaderSettings(JSON.parse(localStorage.getItem(key) ?? "null"));
    } catch {
      return DEFAULT_READER_SETTINGS;
    }
  });
  const [storageError, setStorageError] = useState(false);
  const updateSettings = (next: ReaderSettings) => {
    const validated = parseReaderSettings(next);
    setSettings(validated);
    try {
      localStorage.setItem(key, JSON.stringify(validated));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  };
  return { settings, updateSettings, storageError };
}
