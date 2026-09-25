import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Activity } from '../types/routine';
import { format12Hour, timeToMinutes } from '../utils/timeUtils';
import { chimePlayer } from '../utils/audioChime';

interface ReminderBannerProps {
  activities: Activity[];
  currentMinutes: number;
  remindersEnabled: boolean;
}

export const ReminderBanner: React.FC<ReminderBannerProps> = ({
  activities,
  currentMinutes,
  remindersEnabled,
}) => {
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [lastChimedId, setLastChimedId] = useState<string | null>(null);

  // Find an upcoming activity with reminders enabled starting within 15 minutes
  const upcomingAlertItem = activities.find((item) => {
    if (!item.hasReminder) return false;
    const startM = timeToMinutes(item.startTime);
    let diff = startM - currentMinutes;
    if (diff < 0) diff += 1440; // handles overnight
    return diff > 0 && diff <= 15;
  });

  useEffect(() => {
    if (upcomingAlertItem && remindersEnabled && lastChimedId !== upcomingAlertItem.id) {
      chimePlayer.playGentleChime();
      setLastChimedId(upcomingAlertItem.id);
    }
  }, [upcomingAlertItem, remindersEnabled, lastChimedId]);

  if (!remindersEnabled || !upcomingAlertItem || dismissedId === upcomingAlertItem.id) {
    return null;
  }

  const startM = timeToMinutes(upcomingAlertItem.startTime);
  let diff = startM - currentMinutes;
  if (diff < 0) diff += 1440;

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-md w-full p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex items-start justify-between gap-3 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
          <Bell className="w-4 h-4 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-amber-400">
              Upcoming in {diff} min
            </span>
            <span className="text-2xs text-slate-400 font-mono">
              ({format12Hour(upcomingAlertItem.startTime)})
            </span>
          </div>
          <p className="text-sm font-bold text-white mt-0.5">{upcomingAlertItem.title}</p>
          <p className="text-xs text-slate-300 mt-0.5">
            {upcomingAlertItem.notes || 'Prepare your desk and transition mindfully.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setDismissedId(upcomingAlertItem.id)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          title="Dismiss reminder"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
