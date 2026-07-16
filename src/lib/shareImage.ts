import type { GameRecord } from '../types';
import { APP_NAME } from './brand';
import { formatTime } from './gameLogic';

/** Build a simple shareable PNG of daily result. */
export async function renderShareImage(
  record: GameRecord,
  dailyNumber?: number,
  streak = 0,
): Promise<Blob | null> {
  try {
    const canvas = document.createElement('canvas');
    const w = 720;
    const h = 900;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Brand
    ctx.fillStyle = '#e0e7ff';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(APP_NAME, w / 2, 80);

    if (dailyNumber) {
      ctx.fillStyle = '#a5b4fc';
      ctx.font = '600 28px system-ui, sans-serif';
      ctx.fillText(`Daily #${dailyNumber}`, w / 2, 130);
    }

    // Decorative grid
    const gridSize = 5;
    const cell = 70;
    const gridW = gridSize * cell;
    const ox = (w - gridW) / 2;
    const oy = 180;
    const letters = 'WORDSEEKFINDPLAYGRID'.split('');
    const highlight = new Set([0, 1, 2, 3, 5, 6, 7, 10, 11, 12]);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const i = r * gridSize + c;
        const x = ox + c * cell;
        const y = oy + r * cell;
        if (highlight.has(i)) {
          const g = ctx.createLinearGradient(x, y, x + cell, y + cell);
          g.addColorStop(0, '#7c3aed');
          g.addColorStop(1, '#22d3ee');
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.08)';
        }
        ctx.fillRect(x + 6, y + 6, cell - 12, cell - 12);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 28px system-ui, sans-serif';
        ctx.fillText(letters[i % letters.length], x + cell / 2, y + cell / 2 + 10);
      }
    }

    // Stats
    const time = formatTime(record.timeMs);
    const miss =
      record.wrongAttempts === 0 ? 'Flawless 💎' : `${record.wrongAttempts} miss${record.wrongAttempts === 1 ? '' : 'es'}`;
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.fillText(time, w / 2, 620);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText('YOUR TIME', w / 2, 660);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 28px system-ui, sans-serif';
    ctx.fillText(miss, w / 2, 720);
    if (streak > 0) {
      ctx.fillText(`🔥 ${streak}-day streak`, w / 2, 770);
    }

    ctx.fillStyle = '#64748b';
    ctx.font = '500 20px system-ui, sans-serif';
    ctx.fillText('wordseek · swipe · find · win', w / 2, 850);

    return await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png');
    });
  } catch {
    return null;
  }
}