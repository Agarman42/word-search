import { useState } from 'react';
import { APP_NAME } from '../lib/brand';
import { getActiveSeason } from '../lib/seasonal';
import { dismissSeason, isSeasonDismissed } from '../lib/seasonalDismiss';
import { dismissDailyNudge } from '../lib/dailyNudge';
import { getDailyNumber } from '../lib/daily';
import { todayString } from '../lib/rng';
import { InstallPrompt } from './InstallPrompt';
import { IconSun } from './Icons';

export type AnnouncementType = 'install' | 'daily' | 'seasonal';

interface AnnouncementRailProps {
  canInstall: boolean;
  onInstall: () => void;
  onDismissInstall: () => void;
  showDailyNudge: boolean;
  dailyCompleted: boolean;
  onDaily: () => void;
  onDismissDailyNudge: () => void;
}

function getAnnouncements(props: AnnouncementRailProps): AnnouncementType[] {
  const list: AnnouncementType[] = [];
  if (props.canInstall) list.push('install');
  if (props.showDailyNudge && !props.dailyCompleted) list.push('daily');
  const season = getActiveSeason();
  if (season && !isSeasonDismissed(season.id)) list.push('seasonal');
  return list;
}

export function AnnouncementRail(props: AnnouncementRailProps) {
  const [seasonDismissed, setSeasonDismissed] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);

  const all = getAnnouncements(props).filter(
    (t) => t !== 'seasonal' || !seasonDismissed,
  );
  const [active, ...queued] = all;
  const season = getActiveSeason();
  const today = todayString();

  if (all.length === 0) return null;

  return (
    <div className="announcement-rail">
      {active === 'install' && (
        <InstallPrompt onInstall={props.onInstall} onDismiss={props.onDismissInstall} />
      )}

      {active === 'daily' && (
        <div className="announcement-card panel-card daily-announce">
          <IconSun size={20} className="announce-icon" />
          <div className="announce-body">
            <span className="announce-title">Daily #{getDailyNumber(today)} awaits</span>
            <span className="announce-desc">A fresh puzzle every day — great place to start.</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={props.onDaily}>
            Play
          </button>
          <button
            className="announce-dismiss"
            onClick={() => {
              dismissDailyNudge();
              props.onDismissDailyNudge();
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {active === 'seasonal' && season && (
        <div
          className="announcement-card panel-card seasonal-announce"
          style={{ '--season-color': season.color } as React.CSSProperties}
        >
          <span className="announce-emoji">{season.icon}</span>
          <div className="announce-body">
            <span className="announce-title">{season.name}</span>
            <span className="announce-desc">{season.description}</span>
          </div>
          <button
            className="announce-dismiss"
            onClick={() => {
              dismissSeason(season.id);
              setSeasonDismissed(true);
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {queued.length > 0 && (
        <div className="announce-inbox-wrap">
          <button
            className="announce-inbox-btn"
            onClick={() => setInboxOpen((o) => !o)}
            aria-expanded={inboxOpen}
          >
            +{queued.length} more
          </button>
          {inboxOpen && (
            <div className="announce-inbox panel-card">
              {queued.map((type) => (
                <button
                  key={type}
                  className="announce-inbox-item"
                  onClick={() => {
                    setInboxOpen(false);
                    if (type === 'daily') props.onDaily();
                    if (type === 'install') props.onInstall();
                  }}
                >
                  {type === 'install' && `Install ${APP_NAME} on your device`}
                  {type === 'daily' && `Play Daily #${getDailyNumber(today)}`}
                  {type === 'seasonal' && season?.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}