import React from 'react';
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  Lock,
  ArrowUpDown,
  BookOpen,
  Copy,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Activity } from '../types/routine';
import { format12Hour } from '../utils/timeUtils';
import { ThemeConfig } from '../utils/theme';

interface HelpSectionProps {
  theme: ThemeConfig;
  onLoadDemoTemplate: (demoActivities: Activity[]) => void;
}

export const DEMO_SAMPLE_ACTIVITIES: Activity[] = [
  {
    id: 'demo_wake',
    title: 'Wake Up & Fresh Start',
    category: 'personal',
    type: 'fixed',
    startTime: '05:00',
    endTime: '05:30',
    durationMinutes: 30,
    isLocked: true,
    priority: 'high',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    hasReminder: true,
    notes: 'Hydration and morning freshen up',
  },
  {
    id: 'demo_study',
    title: 'Study / Concept Learning',
    category: 'study',
    type: 'flexible',
    startTime: '06:00',
    endTime: '07:30',
    durationMinutes: 90,
    isLocked: false,
    priority: 'high',
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: false,
    notes: 'High-focus study session',
  },
  {
    id: 'demo_work',
    title: 'Work / Office Hours',
    category: 'work',
    type: 'fixed',
    startTime: '09:00',
    endTime: '17:00',
    durationMinutes: 480,
    isLocked: true,
    priority: 'high',
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: true,
    notes: 'Core professional commitments',
  },
  {
    id: 'demo_travel',
    title: 'Travel / Commute',
    category: 'travel',
    type: 'fixed',
    startTime: '17:00',
    endTime: '18:00',
    durationMinutes: 60,
    isLocked: true,
    priority: 'high',
    repeatDays: [1, 2, 3, 4, 5],
    hasReminder: false,
    notes: 'Transit from work',
  },
  {
    id: 'demo_gym',
    title: 'Gym & Physical Fitness',
    category: 'fitness',
    type: 'flexible',
    startTime: '19:00',
    endTime: '20:00',
    durationMinutes: 60,
    isLocked: false,
    priority: 'high',
    repeatDays: [1, 2, 3, 4, 5, 6],
    hasReminder: true,
    notes: 'Strength training and health',
  },
  {
    id: 'demo_dinner',
    title: 'Dinner & Relaxation',
    category: 'meals',
    type: 'fixed',
    startTime: '20:00',
    endTime: '20:30',
    durationMinutes: 30,
    isLocked: true,
    priority: 'high',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    hasReminder: false,
    notes: 'Healthy dinner and family time',
  },
  {
    id: 'demo_sleep',
    title: 'Sleep & Recovery',
    category: 'sleep',
    type: 'fixed',
    startTime: '23:00',
    endTime: '05:00',
    durationMinutes: 360,
    isLocked: true,
    priority: 'high',
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
    hasReminder: true,
    notes: 'Deep restful restorative sleep',
  },
];

export const HelpSection: React.FC<HelpSectionProps> = ({ theme, onLoadDemoTemplate }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              How Dincharya Smart Planner Works
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Build your personal routine from scratch, and let the smart engine keep your flexible activities perfectly balanced.
            </p>
          </div>
        </div>
      </div>

      {/* Explainer Flow Diagram */}
      <div className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs space-y-5`}>
        <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>The Smart Dincharya Principle</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold block">01. Anchors</span>
            <p className="font-bold text-slate-900 dark:text-white">Fixed Activities</p>
            <p className="text-slate-600 dark:text-slate-400 text-2xs leading-relaxed">
              Work, travel, meals, or sleep have rigid real-world timings. Dincharya treats these as immovable anchors.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold block">02. Shifts</span>
            <p className="font-bold text-slate-900 dark:text-white">Life Happens</p>
            <p className="text-slate-600 dark:text-slate-400 text-2xs leading-relaxed">
              When Work changes from 9:00 AM–5:00 PM to 10:00 AM–6:00 PM, you shouldn't have to manually reschedule everything.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold block">03. Adjustment</span>
            <p className="font-bold text-slate-900 dark:text-white">Flexible Flow</p>
            <p className="text-slate-600 dark:text-slate-400 text-2xs leading-relaxed">
              The engine automatically shifts flexible study, gym, coding, or reading into open gaps without overlaps.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold block">04. Protection</span>
            <p className="font-bold text-slate-900 dark:text-white">Locking Control</p>
            <p className="text-slate-600 dark:text-slate-400 text-2xs leading-relaxed">
              Use 🔒 Lock Activity anytime to ensure a specific activity stays exactly where you set it.
            </p>
          </div>
        </div>

        {/* Visual example equation */}
        <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-400/5 border border-amber-300/40 dark:border-amber-500/20 text-xs">
          <p className="font-bold text-amber-900 dark:text-amber-300 mb-1">
            Example: Work Shift Recalculation
          </p>
          <div className="flex flex-wrap items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-2xs">
            <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
              Work: 9:00 AM–5:00 PM
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            <span className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold px-2 py-1 rounded border border-amber-300">
              Edited: 10:00 AM–6:00 PM
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded border border-emerald-300">
              Study & Gym auto-move to 6:00 PM+ with Zero Conflict
            </span>
          </div>
        </div>
      </div>

      {/* Demo Dincharya (STRICTLY DEMO ONLY) */}
      <div className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-xs space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-2xs font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                DEMO ONLY
              </span>
              <h2 className="text-base font-bold">Sample Reference Routine</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              This sample illustrates a balanced daily timetable. It is not part of your active timetable.
            </p>
          </div>

          <button
            onClick={() => {
              if (
                window.confirm(
                  'Load this demo routine into your Dincharya? You can always edit, delete, or adjust any activity.'
                )
              ) {
                onLoadDemoTemplate(DEMO_SAMPLE_ACTIVITIES);
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 shrink-0 self-start sm:self-center cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Load as Template into My Planner</span>
          </button>
        </div>

        {/* Demo List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {DEMO_SAMPLE_ACTIVITIES.map((act) => (
            <div key={act.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-200 w-28 shrink-0">
                  {format12Hour(act.startTime)} – {format12Hour(act.endTime)}
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{act.title}</span>
                <span
                  className={`text-2xs px-1.5 py-0.5 rounded font-medium ${
                    act.type === 'fixed'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {act.type === 'fixed' ? 'Fixed' : 'Flexible'}
                </span>
              </div>
              <span className="text-2xs text-slate-500 font-mono">{act.durationMinutes}m</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
