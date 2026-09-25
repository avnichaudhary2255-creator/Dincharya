import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Edit2,
  Trash2,
  Plus,
  Sparkles,
  Clock,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from 'lucide-react';
import { Activity } from '../types/routine';
import { format12Hour, formatDuration, timeToMinutes } from '../utils/timeUtils';
import { CATEGORY_MAP } from '../utils/categoryMeta';
import { ThemeConfig } from '../utils/theme';

interface RoutineTimelineProps {
  activities: Activity[];
  currentMinutes: number;
  theme: ThemeConfig;
  onToggleComplete: (id: string) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onToggleLock: (id: string) => void;
  onOpenAddModal: () => void;
  onAdjustDincharya: () => void;
}

export const RoutineTimeline: React.FC<RoutineTimelineProps> = ({
  activities,
  currentMinutes,
  theme,
  onToggleComplete,
  onEditActivity,
  onDeleteActivity,
  onToggleLock,
  onOpenAddModal,
  onAdjustDincharya,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'fixed' | 'flexible'>('all');

  // Sort chronologically
  const sortedActivities = [...activities].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const filtered = sortedActivities.filter((act) => {
    if (filterType === 'fixed') return act.type === 'fixed' || act.isLocked;
    if (filterType === 'flexible') return act.type === 'flexible' && !act.isLocked;
    return true;
  });

  if (activities.length === 0) {
    return (
      <div className="py-12 sm:py-16 flex items-center justify-center">
        <div
          className={`max-w-md w-full text-center p-8 rounded-3xl border ${theme.cardBg} ${theme.cardBorder} shadow-sm space-y-6 animate-slide-up`}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center text-3xl">
            🌸
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Your Dincharya is waiting to be created
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Add your first activity and build a routine that fits your life.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenAddModal}
              className={`w-full py-3.5 px-6 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${theme.primaryBtn}`}
            >
              <Plus className="w-4 h-4" />
              <span>+ Add First Activity</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Chronological Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your customized daily schedule. Edit any timing, and flexible activities will automatically adjust.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onAdjustDincharya}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ Adjust My Dincharya</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer ${theme.primaryBtn}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Activity</span>
          </button>
        </div>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl border border-slate-300/60 dark:border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Activities ({activities.length})
          </button>
          <button
            onClick={() => setFilterType('fixed')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              filterType === 'fixed'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3 h-3 text-slate-500" />
            <span>Fixed / Locked</span>
          </button>
          <button
            onClick={() => setFilterType('flexible')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              filterType === 'flexible'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpDown className="w-3 h-3 text-blue-500" />
            <span>Flexible Only</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-2xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Fixed / Locked (Cannot auto-move)</span>
          </span>
          <span className="flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-blue-500" />
            <span>Flexible (Adjusts around fixed)</span>
          </span>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filtered.map((act) => {
          const startM = timeToMinutes(act.startTime);
          let endM = timeToMinutes(act.endTime);
          if (endM <= startM) endM += 1440;
          const isCurrent = currentMinutes >= startM && currentMinutes < endM;
          const meta = CATEGORY_MAP[act.category];
          const Icon = meta.icon;

          return (
            <div
              key={act.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${theme.cardBg} ${
                isCurrent
                  ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/20 shadow-md'
                  : theme.cardBorder
              } shadow-xs hover:border-slate-400 dark:hover:border-slate-600`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left section: Checkbox, Timings, Icon, Title */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => onToggleComplete(act.id)}
                    className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                    title={act.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {act.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  {/* Timings Badge */}
                  <div className="shrink-0 w-28 sm:w-32">
                    <span className="text-xs font-mono font-bold block tabular-nums text-slate-900 dark:text-white">
                      🕐 {format12Hour(act.startTime)}
                    </span>
                    <span className="text-2xs font-mono text-slate-500 block tabular-nums">
                      to {format12Hour(act.endTime)}
                    </span>
                  </div>

                  {/* Category Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.badgeBg} ${meta.badgeText}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-sm sm:text-base font-bold ${
                          act.isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {act.title}
                      </h3>

                      {isCurrent && (
                        <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                          Current
                        </span>
                      )}

                      {/* Fixed vs Flexible badge */}
                      <span
                        className={`text-2xs px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                          act.type === 'fixed' || act.isLocked
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {act.type === 'fixed' || act.isLocked ? (
                          <>
                            <Lock className="w-2.5 h-2.5" />
                            <span>Fixed</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpDown className="w-2.5 h-2.5 text-blue-500" />
                            <span>Flexible</span>
                          </>
                        )}
                      </span>

                      {/* Priority */}
                      <span
                        className={`text-2xs px-1.5 py-0.5 rounded font-medium capitalize ${
                          act.priority === 'high'
                            ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                            : act.priority === 'medium'
                            ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                            : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        {act.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                      <span>⏱ {formatDuration(act.durationMinutes)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{meta.label}</span>
                      {act.notes && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-600 dark:text-slate-300 truncate max-w-xs">
                            {act.notes}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right action buttons: Edit, Delete, Lock */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Lock / Unlock button */}
                  <button
                    onClick={() => onToggleLock(act.id)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      act.isLocked
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                    title={act.isLocked ? 'Locked (Click to unlock)' : 'Unlocked (Click to lock timing)'}
                  >
                    {act.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => onEditActivity(act)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Edit activity"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteActivity(act.id)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                    title="Delete activity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
