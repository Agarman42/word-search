import { CURATED_WORD_LABELS, toGridForm } from './curatedPacks';

/** Human label for the word list / toasts. Keeps Ka$h, New York, etc. */
export function displayWord(word: string): string {
  const key = toGridForm(word);
  return CURATED_WORD_LABELS[key] ?? word;
}
