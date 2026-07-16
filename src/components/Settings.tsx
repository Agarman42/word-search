import type { GameMode, Settings as SettingsType, SoundPack } from '../types';
import { DIFFICULTY_PRESETS, applyDifficultyPreset } from '../lib/difficulty';
import { getVersionLabel } from '../lib/version';
import { ScreenHeader } from './ScreenHeader';


interface SettingsProps {
  settings: SettingsType;
  onChange: (patch: Partial<SettingsType>) => void;
}

const GRID_SIZES = [8, 10, 12, 15];
const WORD_COUNTS = [8, 10, 12, 15, 18];
const FONT_SCALES = [
  { value: 1, label: 'S' },
  { value: 1.15, label: 'M' },
  { value: 1.3, label: 'L' },
];

const SOUND_PACKS: { value: SoundPack; label: string; desc: string }[] = [
  { value: 'classic', label: 'Classic', desc: 'Rich melodic chimes' },
  { value: 'minimal', label: 'Minimal', desc: 'Soft, subtle tones' },
  { value: 'off', label: 'Off', desc: 'Silent gameplay' },
];

const GAME_MODES: { value: GameMode; label: string; desc: string }[] = [
  { value: 'relaxed', label: 'Relaxed', desc: 'No timer — play at your pace' },
  { value: 'timed', label: 'Timed', desc: 'Race the clock and beat your best' },
  { value: 'blitz', label: 'Blitz', desc: '60 seconds — find as many as you can' },
  { value: 'zen', label: 'Zen', desc: 'Hidden word list — pure discovery' },
  { value: 'coop', label: 'Co-op', desc: 'Pass & play — alternate finds' },
];

export function Settings({ settings, onChange }: SettingsProps) {
  const applyPreset = (preset: keyof typeof DIFFICULTY_PRESETS) => {
    onChange(applyDifficultyPreset(preset));
  };

  return (
    <div className="screen settings-screen">
      <ScreenHeader title="Settings" subtitle="Customize your experience" />

      <div className="settings-sections">
        <section className="settings-section">
          <h3>Difficulty</h3>
          <div className="setting-options">
            {(Object.keys(DIFFICULTY_PRESETS) as (keyof typeof DIFFICULTY_PRESETS)[]).map((key) => (
              <button
                key={key}
                className={`mode-btn ${settings.difficultyPreset === key ? 'active' : ''}`}
                onClick={() => applyPreset(key)}
              >
                <span className="mode-label">{DIFFICULTY_PRESETS[key].label}</span>
                <span className="mode-desc">{DIFFICULTY_PRESETS[key].desc}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h3>Game Mode</h3>
          <div className="mode-options">
            {GAME_MODES.map((mode) => (
              <button
                key={mode.value}
                className={`mode-btn ${settings.gameMode === mode.value ? 'active' : ''}`}
                onClick={() => onChange({ gameMode: mode.value })}
              >
                <span className="mode-label">{mode.label}</span>
                <span className="mode-desc">{mode.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {settings.difficultyPreset === 'custom' && (
          <section className="settings-section">
            <h3>Custom</h3>
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Grid Size</span>
              </div>
              <div className="setting-options">
                {GRID_SIZES.map((size) => (
                  <button
                    key={size}
                    className={`option-btn ${settings.gridSize === size ? 'active' : ''}`}
                    onClick={() => onChange({ gridSize: size })}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
            </div>
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Word Count</span>
              </div>
              <div className="setting-options">
                {WORD_COUNTS.map((count) => (
                  <button
                    key={count}
                    className={`option-btn ${settings.wordCount === count ? 'active' : ''}`}
                    onClick={() => onChange({ wordCount: count })}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            <label className="toggle-row">
              <div className="setting-info">
                <span className="setting-label">Allow Backwards</span>
                <span className="setting-desc">Words can run in reverse directions</span>
              </div>
              <input
                type="checkbox"
                checked={settings.allowBackwards}
                onChange={(e) => onChange({ allowBackwards: e.target.checked })}
              />
            </label>
          </section>
        )}

        <section className="settings-section">
          <h3>Accessibility</h3>
          <label className="toggle-row">
            <div className="setting-info">
              <span className="setting-label">Colorblind Patterns</span>
              <span className="setting-desc">Patterns on found words, not just color</span>
            </div>
            <input
              type="checkbox"
              checked={settings.colorblindMode}
              onChange={(e) => onChange({ colorblindMode: e.target.checked })}
            />
          </label>
          <label className="toggle-row">
            <div className="setting-info">
              <span className="setting-label">High Contrast</span>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => onChange({ highContrast: e.target.checked })}
            />
          </label>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Letter Size</span>
            </div>
            <div className="setting-options">
              {FONT_SCALES.map((s) => (
                <button
                  key={s.value}
                  className={`option-btn ${settings.fontScale === s.value ? 'active' : ''}`}
                  onClick={() => onChange({ fontScale: s.value })}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <label className="toggle-row">
            <div className="setting-info">
              <span className="setting-label">One-Hand Mode</span>
              <span className="setting-desc">Word list positioned for thumb reach</span>
            </div>
            <input
              type="checkbox"
              checked={settings.oneHandMode}
              onChange={(e) => onChange({ oneHandMode: e.target.checked })}
            />
          </label>
        </section>

        <section className="settings-section">
          <h3>Appearance</h3>
          <label className="toggle-row">
            <div className="setting-info">
              <span className="setting-label">Dark Background</span>
              <span className="setting-desc">White background is the default</span>
            </div>
            <input
              type="checkbox"
              checked={!settings.lightBackground}
              onChange={(e) => onChange({ lightBackground: !e.target.checked })}
            />
          </label>
        </section>

        <section className="settings-section">
          <h3>Preferences</h3>
          <label className="toggle-row">
            <div className="setting-info">
              <span className="setting-label">Did You Know Facts</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showFacts}
              onChange={(e) => onChange({ showFacts: e.target.checked })}
            />
          </label>
          <label className="toggle-row">
            <div className="setting-info">
              <span className="setting-label">Haptic Feedback</span>
            </div>
            <input
              type="checkbox"
              checked={settings.haptics}
              onChange={(e) => onChange({ haptics: e.target.checked })}
            />
          </label>
          <label className="toggle-row">
            <div className="setting-info">
              <span className="setting-label">Sound Effects</span>
            </div>
            <input
              type="checkbox"
              checked={settings.sound && settings.soundPack !== 'off'}
              onChange={(e) =>
                onChange({
                  sound: e.target.checked,
                  soundPack: e.target.checked
                    ? settings.soundPack === 'off'
                      ? 'classic'
                      : settings.soundPack
                    : 'off',
                })
              }
            />
          </label>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Sound Pack</span>
              <span className="setting-desc">Choose your audio style</span>
            </div>
            <div className="setting-options sound-pack-options">
              {SOUND_PACKS.map((pack) => (
                <button
                  key={pack.value}
                  className={`mode-btn compact ${settings.soundPack === pack.value ? 'active' : ''}`}
                  onClick={() =>
                    onChange({
                      soundPack: pack.value,
                      sound: pack.value !== 'off',
                    })
                  }
                >
                  <span className="mode-label">{pack.label}</span>
                  <span className="mode-desc">{pack.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <label className="toggle-row">
            <div className="setting-info">
              <span className="setting-label">Reduce Motion</span>
            </div>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => onChange({ reduceMotion: e.target.checked })}
            />
          </label>
        </section>

        <section className="settings-section settings-about">
          <h3>About</h3>
          <p className="about-text">
            A premium word search experience. Progress is saved locally on this device.
          </p>
          <p className="about-version">{getVersionLabel()}</p>
        </section>
      </div>
    </div>
  );
}