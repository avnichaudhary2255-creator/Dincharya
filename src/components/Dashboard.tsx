import React, { useMemo } from 'react';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Briefcase,
  Hourglass,
  ArrowRight,
  Lock,
  ArrowUpDown,
} from 'lucide-react';
import { Activity, SmartAdjustResult } from '../types/routine';
import {
  format12Hour,
  formatDuration,
  formatTimeRemaining,
  formatTimeUntilStart,
  timeToMinutes,
} from '../utils/timeUtils';
import { CATEGORY_MAP } from '../utils/categoryMeta';
import { ThemeConfig } from '../utils/theme';

interface DashboardProps {
  activities: Activity[];
  adjustResult: SmartAdjustResult;
  currentMinutes: number;
  theme: ThemeConfig;
  onToggleComplete: (id: string) => void;
  onAdjustDincharya: () => void;
  onOpenAddModal: () => void;
  onNavigateToTimetable: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  activities,
  adjustResult,
  currentMinutes,
  theme,
  onToggleComplete,
  onAdjustDincharya,
  onOpenAddModal,
  onNavigateToTimetable,
}) => {
  // Compute Current Activity & Next Activity
  const { currentActivity, nextActivity } = useMemo(() => {
    let current: Activity | null = null;
    let next: Activity | null = null;

    const sorted = [...activities].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    for (let i = 0; i < sorted.length; i++) {
      const act = sorted[i];
      const start = timeToMinutes(act.startTime);
      let end = timeToMinutes(act.endTime);
      if (end <= start) end += 1440;

      if (currentMinutes >= start && currentMinutes < end) {
        current = act;
        if (i + 1 < sorted.length) next = sorted[i + 1];
        break;
      } else if (start > currentMinutes) {
        if (!next) next = act;
      }
    }

    if (!next && sorted.length > 0 && !current) {
      next = sorted[0]; // wraps to next day first activity
    }

    return { currentActivity: current, nextActivity: next };
  }, [activities, currentMinutes]);

  // Completion stats
  const completedCount = activities.filter((a) => a.isCompleted).length;
  const totalCount = activities.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Work / Study Time and Free Time
  const workStudyMinutes = adjustResult.workStudyMinutes;
  const freeMinutes = adjustResult.totalFreeMinutes;

  const todayDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const currentTimeFormatted = format12Hour(
    `${Math.floor(currentMinutes / 60)
      .toString()
      .padStart(2, '0')}:${(currentMinutes % 60).toString().padStart(2, '0')}`
  );

  // 10. EMPTY STATE
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
      {/* Header Banner */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{todayDateFormatted}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                {currentTimeFormatted}
              </span>
              <span aria-hidden="true">·</span>
              <span>{activities.length} Planned Activities</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
              Today's Dincharya
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Live routine overview with dynamic recalculation around your fixed anchors.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onAdjustDincharya}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ Adjust My Dincharya</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Current Activity, Next Activity, and Day Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Current Activity Spotlight (2 cols on desktop) */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs flex flex-col justify-between space-y-5`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Current Activity
                </span>
              </div>
              {currentActivity && (
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {formatTimeRemaining(currentActivity.endTime, currentMinutes)}
                </span>
              )}
            </div>

            {currentActivity ? (
              <div className="py-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>{CATEGORY_MAP[currentActivity.category].label}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {format12Hour(currentActivity.startTime)} – {format12Hour(currentActivity.endTime)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDuration(currentActivity.durationMinutes)}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {currentActivity.title}
                    </h2>

                    {currentActivity.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {currentActivity.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`text-2xs px-2 py-1 rounded-md font-semibold flex items-center gap-1 ${
                        currentActivity.type === 'fixed'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {currentActivity.type === 'fixed' ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Fixed</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpDown className="w-3 h-3" />
                          <span>Flexible</span>
                        </>
                      )}
                    </span>

                    <button
                      onClick={() => onToggleComplete(currentActivity.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                        currentActivity.isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{currentActivity.isCompleted ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                <Clock className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-medium">No active activity at this exact hour</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enjoy your free time or check your upcoming schedule below.
                </p>
              </div>
            )}
          </div>

          {/* Up Next Strip */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Next Activity:</span>
            {nextActivity ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {nextActivity.title}
                </span>
                <span className="font-mono text-slate-500">
                  ({format12Hour(nextActivity.startTime)})
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  {formatTimeUntilStart(nextActivity.startTime, currentMinutes)}
                </span>
              </div>
            ) : (
              <span className="text-slate-500">All planned activities finished for today</span>
            )}
          </div>
        </div>

        {/* Productivity & Balance Summary Card */}
        <div
          className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs flex flex-col justify-between space-y-4`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Today's Progress
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                {completedCount}/{totalCount} Completed
              </span>
            </div>

            {/* Circular Progress & Percentage */}
            <div className="py-4 flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-500"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-mono text-sm font-bold">{progressPercent}%</span>
              </div>

              <div>
                <p className="text-sm font-bold">Routine Execution</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {completedCount === totalCount
                    ? 'All activities accomplished!'
                    : `${totalCount - completedCount} activities remaining`}
                </p>
              </div>
            </div>

            {/* Work/Study Time & Free Time metrics */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Work & Study Time</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatDuration(workStudyMinutes)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Hourglass className="w-3.5 h-3.5 text-teal-500" />
                  <span>Available Free Time</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatDuration(freeMinutes)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onNavigateToTimetable}
              className="w-full py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Full Timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Completed Activities Quick Checklist */}
      <div className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs space-y-4`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold">Today's Activity Checklist</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check off activities as you progress through your day.
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Activity</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {activities.map((act) => {
            const meta = CATEGORY_MAP[act.category];
            const Icon = meta.icon;

            return (
              <div
                key={act.id}
                className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => onToggleComplete(act.id)}
                    className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                    title={act.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {act.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white w-28 shrink-0">
                    {format12Hour(act.startTime)} – {format12Hour(act.endTime)}
                  </span>

                  <span
                    className={`font-semibold truncate ${
                      act.isCompleted
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {act.title}
                  </span>

                  <span
                    className={`hidden sm:inline-flex text-2xs px-2 py-0.5 rounded font-medium ${
                      act.type === 'fixed'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {act.type === 'fixed' ? 'Fixed' : 'Flexible'}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-2xs text-slate-500">
                    {formatDuration(act.durationMinutes)}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${meta.badgeBg} ${meta.badgeText}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
