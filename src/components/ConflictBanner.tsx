import React from 'react';
import { AlertTriangle, Sparkles, Edit2, X } from 'lucide-react';
import { ScheduleConflict, Activity } from '../types/routine';

interface ConflictBannerProps {
  conflicts: ScheduleConflict[];
  onAutoResolve: () => void;
  onEditActivity: (activity: Activity) => void;
  onDismiss: () => void;
}

export const ConflictBanner: React.FC<ConflictBannerProps> = ({
  conflicts,
  onAutoResolve,
  onEditActivity,
  onDismiss,
}) => {
  if (conflicts.length === 0) return null;

  return (
    <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                ⚠️ Schedule Conflict Detected ({conflicts.length})
              </span>
            </div>
            <div className="space-y-1 mt-1">
              {conflicts.map((c) => (
                <p key={c.id} className="text-xs font-medium text-rose-900 dark:text-rose-200">
                  {c.message}
                </p>
              ))}
            </div>
            <p className="text-2xs text-rose-700 dark:text-rose-300 mt-1">
              Dincharya never leaves conflicting overlapping slots. You can auto-recalculate flexible activities or edit timings manually.
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 rounded-lg cursor-pointer"
          title="Keep both manually / Dismiss warning"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rose-200 dark:border-rose-900/60">
        <button
          onClick={onAutoResolve}
          className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Auto-Move Flexible Activities</span>
        </button>

        {conflicts.length > 0 && (
          <button
            onClick={() => onEditActivity(conflicts[0].activity2)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit "{conflicts[0].activity2.title}" Timing</span>
          </button>
        )}
      </div>
    </div>
  );
};
