import type { PlacedWord, Settings } from '../types';

interface WordListProps {
  words: PlacedWord[];
  foundWords: Map<string, string>;
  settings: Settings;
  zenMode?: boolean;
  favoriteWords?: string[];
  onToggleFavorite?: (word: string) => void;
}

export function WordList({
  words,
  foundWords,
  settings,
  zenMode = false,
  favoriteWords = [],
  onToggleFavorite,
}: WordListProps) {
  const sorted = [...words].sort((a, b) => a.word.localeCompare(b.word));
  const foundCount = foundWords.size;
  const hiddenCount = words.length - foundCount;

  const visibleWords = zenMode
    ? sorted.filter((w) => foundWords.has(w.word))
    : sorted;

  return (
    <div className={`word-list glass-panel ${settings.oneHandMode ? 'one-hand' : ''}`}>
      <div className="word-list-header">
        <div className="word-list-title-group">
          <span className="word-list-title">
            {zenMode ? 'Discovered' : 'Words to find'}
          </span>
          <div className="word-list-mini-bar">
            <div
              className="word-list-mini-fill"
              style={{ width: `${(foundCount / words.length) * 100}%` }}
            />
          </div>
        </div>
        <span className="word-list-count">
          {zenMode && hiddenCount > 0 ? (
            <span className="zen-remaining">{hiddenCount} hidden</span>
          ) : (
            <>
              <span className="count-found">{foundCount}</span>
              <span className="count-sep">/</span>
              <span className="count-total">{words.length}</span>
            </>
          )}
        </span>
      </div>
      <div className="word-list-scroll">
        <div className="word-list-items">
          {zenMode && foundCount === 0 && (
            <p className="zen-hint">Swipe the grid — words appear as you discover them.</p>
          )}
          {visibleWords.map((w) => {
            const color = foundWords.get(w.word);
            const found = !!color;
            const isFav = favoriteWords.includes(w.word);

            return (
              <div
                key={w.word}
                className={`word-chip ${found ? 'found' : ''}`}
                style={found ? { '--chip-color': color } as React.CSSProperties : undefined}
              >
                <span className="word-text">{w.word}</span>
                {found && onToggleFavorite && (
                  <button
                    className={`fav-btn ${isFav ? 'active' : ''}`}
                    onClick={() => onToggleFavorite(w.word)}
                    aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                  >
                    {isFav ? '★' : '☆'}
                  </button>
                )}
                {found && (
                  <span className="word-check">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}