import { useState } from 'react';
import type { PlacedWord, Settings } from '../types';
import { IconStar } from './Icons';

interface WordListProps {
  words: PlacedWord[];
  foundWords: Map<string, string>;
  settings: Settings;
  zenMode?: boolean;
  hintWord?: string | null;
  favoriteWords?: string[];
  onToggleFavorite?: (word: string) => void;
}

export function WordList({
  words,
  foundWords,
  settings,
  zenMode = false,
  hintWord,
  favoriteWords = [],
  onToggleFavorite,
}: WordListProps) {
  const [expanded, setExpanded] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 600px)').matches,
  );
  const sorted = [...words].sort((a, b) => a.word.localeCompare(b.word));
  const foundCount = foundWords.size;
  const hiddenCount = words.length - foundCount;
  const unfound = sorted.filter((w) => !foundWords.has(w.word));

  const visibleWords = zenMode
    ? sorted.filter((w) => foundWords.has(w.word))
    : sorted;

  const handleToggle = () => setExpanded((e) => !e);

  return (
    <div className={`word-list panel-card ${settings.oneHandMode ? 'one-hand' : ''} ${expanded ? 'expanded' : 'collapsed'}`}>
      <button
        className="word-list-toggle"
        onClick={handleToggle}
        aria-expanded={expanded}
      >
        <span className="word-list-title">
          {zenMode ? 'Discovered' : 'Words to find'}
          <span className={`word-list-count-inline ${!expanded ? 'count-pill' : ''}`}>
            {foundCount}/{words.length}
          </span>
        </span>
        <span className="word-list-chevron">{expanded ? '▾' : '▸'}</span>
      </button>

      {!expanded && !zenMode && hiddenCount > 0 && (
        <button className="word-list-peek" onClick={handleToggle} aria-label="Expand word list">
          {unfound.slice(0, 3).map((w) => (
            <span key={w.word} className={`word-peek-chip ${hintWord === w.word ? 'hint' : ''}`}>
              {w.word}
            </span>
          ))}
          {hiddenCount > 3 && (
            <span className="word-peek-more">+{hiddenCount - 3}</span>
          )}
        </button>
      )}

      {expanded && (
        <div className="word-list-body">
          {zenMode && foundCount === 0 && (
            <p className="zen-hint">Swipe the grid — words appear as you discover them.</p>
          )}
          {zenMode && hiddenCount > 0 && foundCount > 0 && (
            <p className="zen-remaining">{hiddenCount} still hidden</p>
          )}
          <ul className="word-list-columns">
            {visibleWords.map((w) => {
              const found = foundWords.has(w.word);
              const isHint = hintWord === w.word;
              const isFav = favoriteWords.includes(w.word);

              return (
                <li
                  key={w.word}
                  className={[
                    'word-list-item',
                    found && 'found',
                    isHint && 'hint-word',
                    w.word.length >= 10 && 'long',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="word-list-text">{w.word}</span>
                  {found && onToggleFavorite && (
                    <button
                      className={`fav-btn ${isFav ? 'active' : ''}`}
                      onClick={() => onToggleFavorite(w.word)}
                      aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                    >
                      <IconStar size={14} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}