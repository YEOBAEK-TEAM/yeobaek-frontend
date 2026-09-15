import { useEffect, useId, useState } from "react";
import { getDictionaryEntry } from "../../../mocks/dictionary";

type Props = {
  text: string;
  saved: boolean;
  canSave: boolean;
  onSave: () => void;
  onComplete: () => void;
};

export default function WordMeaningCard({ text, saved, canSave, onSave, onComplete }: Props) {
  const [meaningsOpen, setMeaningsOpen] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    if (!completed) return;
    const timer = window.setTimeout(onComplete, 1800);
    return () => window.clearTimeout(timer);
  }, [completed, onComplete]);
  const id = useId();
  const entry = getDictionaryEntry(text);
  return (
    <section
      className={`book-reader__word-card${completed ? " is-saved" : ""}`}
      aria-label={`${entry.word} 뜻`}
    >
      <header className="book-reader__word-heading">
        <span className="book-reader__meaning-number" aria-hidden="true">
          1
        </span>
        <h2>{entry.word}</h2>
        <span className="book-reader__part-of-speech">{entry.partOfSpeech}</span>
        <span className="book-reader__meaning-badge">이 페이지의 의미</span>
      </header>
      <p className="book-reader__current-meaning">{entry.currentMeaning}</p>
      <div className="book-reader__word-details">
        {entry.otherMeanings.length > 0 && (
          <>
            <button
              className="book-reader__meanings-toggle"
              type="button"
              aria-expanded={meaningsOpen}
              aria-controls={`${id}-meanings`}
              onClick={() => setMeaningsOpen(!meaningsOpen)}
              disabled={completed}
            >
              {meaningsOpen ? "다른 뜻 접기" : `다른 뜻 ${entry.otherMeanings.length}개 더 보기`}{" "}
              <span aria-hidden="true">{meaningsOpen ? "⌃" : "⌄"}</span>
            </button>
            <ol
              id={`${id}-meanings`}
              className="book-reader__other-meanings"
              start={2}
              hidden={!meaningsOpen}
            >
              {entry.otherMeanings.map((meaning, index) => (
                <li key={meaning}>
                  <span className="book-reader__meaning-number" aria-hidden="true">
                    {index + 2}
                  </span>
                  <span>
                    {meaning} <small>{entry.partOfSpeech}</small>
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
        <ul id={`${id}-examples`} className="book-reader__word-examples" hidden={!examplesOpen}>
          {entry.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
          {entry.examples.length === 0 && <li>아직 등록된 예문이 없습니다.</li>}
        </ul>
      </div>
      <div className="book-reader__word-buttons">
        {(!saved || completed) && (
          <button
            type="button"
            className={completed ? "is-active" : undefined}
            onClick={() => {
              if (saved || completed || !canSave) return;
              setMeaningsOpen(false);
              setExamplesOpen(false);
              setCompleted(true);
              onSave();
            }}
            disabled={!canSave || completed}
          >
            단어장에 담기
          </button>
        )}
        <button
          type="button"
          className={examplesOpen ? "is-active" : undefined}
          aria-pressed={examplesOpen}
          aria-expanded={examplesOpen}
          aria-controls={`${id}-examples`}
          onClick={() => setExamplesOpen(!examplesOpen)}
          disabled={completed}
        >
          예문 보기
        </button>
      </div>
      {completed && (
        <div className="book-reader__word-saved-toast" role="status">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="m4 12 5 5L20 6" />
          </svg>
          단어 저장 완료!
        </div>
      )}
      {!saved && !canSave && (
        <p className="book-reader__word-hint" role="status">
          단어 하나를 선택하면 단어장에 담을 수 있습니다.
        </p>
      )}
    </section>
  );
}
