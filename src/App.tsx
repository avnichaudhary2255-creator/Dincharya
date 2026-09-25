import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, ThemeMode, SmartAdjustResult, ScheduleConflict } from './types/routine';
import { THEMES } from './utils/theme';
import { smartAdjustSchedule, detectConflicts } from './utils/schedulerEngine';
import { getCurrentMinutesToday } from './utils/timeUtils';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { RoutineTimeline } from './components/RoutineTimeline';
import { HelpSection } from './components/HelpSection';
import { ActivityModal } from './components/ActivityModal';
import { ConflictBanner } from './components/ConflictBanner';
import { ReminderBanner } from './components/ReminderBanner';

export default function App() {
  // 1. Welcome Screen State
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dincharya_welcome_seen') !== 'true';
    } catch {
      return true;
    }
  });

  // 2. Theme State
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('dincharya_theme') as ThemeMode;
      return saved && THEMES[saved] ? saved : 'spiritual';
    } catch {
      return 'spiritual';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dincharya_theme', themeMode);
    } catch {
      // ignore
    }
  }, [themeMode]);

  const activeTheme = THEMES[themeMode];

  // 3. User's Dincharya Activities (INITIALLY EMPTY for new users!)
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem('dincharya_user_activities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save activities to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('dincharya_user_activities', JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [activities]);

  // 4. Undo History Stack & Adjustment Log
  const [undoStack, setUndoStack] = useState<Activity[][]>([]);
  const [lastAdjustmentsLog, setLastAdjustmentsLog] = useState<string[] | null>(null);

  // 5. Current Tab & Navigation
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'timetable' | 'help'>('dashboard');

  // 6. Modal & Edit States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [dismissedConflictIds, setDismissedConflictIds] = useState<Set<string>>(new Set());

  // 7. Reminders Enabled
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('dincharya_reminders');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dincharya_reminders', remindersEnabled.toString());
    } catch {
      // ignore
    }
  }, [remindersEnabled]);

  // 8. Live Clock
  const [currentMinutes, setCurrentMinutes] = useState<number>(getCurrentMinutesToday());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMinutes(getCurrentMinutesToday());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // 9. Core Dynamic Scheduler Calculations & Single Source of Truth
  const adjustResult: SmartAdjustResult = useMemo(() => {
    return smartAdjustSchedule(activities);
  }, [activities]);

  // Filter out any dismissed conflicts
  const activeConflicts = useMemo(() => {
    return adjustResult.conflicts.filter((c) => !dismissedConflictIds.has(c.id));
  }, [adjustResult.conflicts, dismissedConflictIds]);

  // Handlers
  const handleEnterFromWelcome = () => {
    setShowWelcome(false);
    try {
      localStorage.setItem('dincharya_welcome_seen', 'true');
    } catch {
      // ignore
    }
  };

  const handleReopenWelcome = () => {
    setShowWelcome(true);
  };

  // Add / Edit Activity
  const handleSaveActivity = useCallback(
    (newAct: Activity) => {
      setActivities((prev) => {
        const existingIndex = prev.findIndex((a) => a.id === newAct.id);
        let updated: Activity[];
        if (existingIndex >= 0) {
          // Editing existing activity
          updated = [...prev];
          updated[existingIndex] = newAct;
        } else {
          // Adding new activity
          updated = [...prev, newAct];
        }

        // Auto-recalculate if fixed activity was changed to keep timetable harmonized
        if (newAct.type === 'fixed' || newAct.isLocked) {
          const autoRes = smartAdjustSchedule(updated);
          return autoRes.activities;
        }

        return updated;
      });

      setEditingActivity(null);
    },
    []
  );

  // Delete Activity
  const handleDeleteActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Toggle Lock
  const handleToggleLock = useCallback((id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isLocked: !a.isLocked } : a))
    );
  }, []);

  // Toggle Completion
  const handleToggleComplete = useCallback((id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isCompleted: !a.isCompleted } : a))
    );
  }, []);

  // ✨ Adjust My Dincharya (Manual or auto trigger)
  const handleAdjustDincharya = useCallback(() => {
    if (activities.length === 0) return;

    // Push current state to undo stack
    setUndoStack((prev) => [...prev, activities]);

    const result = smartAdjustSchedule(activities);
    setActivities(result.activities);
    setLastAdjustmentsLog(result.adjustmentsMade);
  }, [activities]);

  // ↩ Undo Smart Adjustment
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setActivities(previous);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setLastAdjustmentsLog(null);
  }, [undoStack]);

  // Load Demo Template from Help Section (ONLY on user explicit choice)
  const handleLoadDemoTemplate = useCallback((demoActivities: Activity[]) => {
    setActivities(demoActivities);
    setCurrentTab('timetable');
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans ${activeTheme.bodyClass}`}>
      {/* 1. Welcome Screen (first time or on click) */}
      {showWelcome && <WelcomeScreen onEnter={handleEnterFromWelcome} />}

      {/* 2. Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={activeTheme}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        remindersEnabled={remindersEnabled}
        setRemindersEnabled={setRemindersEnabled}
        canUndo={undoStack.length > 0}
        onUndo={handleUndo}
        onAdjustDincharya={handleAdjustDincharya}
        onOpenAddModal={() => {
          setEditingActivity(null);
          setIsAddModalOpen(true);
        }}
        onReopenWelcome={handleReopenWelcome}
      />

      {/* 3. Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Conflict Warning Banner if overlaps exist */}
        <ConflictBanner
          conflicts={activeConflicts}
          onAutoResolve={handleAdjustDincharya}
          onEditActivity={(act) => {
            setEditingActivity(act);
            setIsAddModalOpen(true);
          }}
          onDismiss={() => {
            setDismissedConflictIds(new Set(activeConflicts.map((c) => c.id)));
          }}
        />

        {/* Smart Adjustment Feedback Banner */}
        {lastAdjustmentsLog && lastAdjustmentsLog.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 dark:text-amber-100">
            <div className="space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <span>✨ Dincharya Recalculated:</span>
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-2xs text-amber-900 dark:text-amber-200 font-mono">
                {lastAdjustmentsLog.slice(0, 3).map((adj, i) => (
                  <li key={i}>{adj}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleUndo}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 text-amber-900 dark:text-amber-200 rounded-lg font-semibold text-2xs hover:bg-amber-100 cursor-pointer"
              >
                ↩ Undo Adjustment
              </button>
              <button
                onClick={() => setLastAdjustmentsLog(null)}
                className="text-amber-700 dark:text-amber-400 hover:underline text-2xs font-semibold px-2 py-1 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Dashboard */}
        {currentTab === 'dashboard' && (
          <Dashboard
            activities={activities}
            adjustResult={adjustResult}
            currentMinutes={currentMinutes}
            theme={activeTheme}
            onToggleComplete={handleToggleComplete}
            onAdjustDincharya={handleAdjustDincharya}
            onOpenAddModal={() => {
              setEditingActivity(null);
              setIsAddModalOpen(true);
            }}
            onNavigateToTimetable={() => setCurrentTab('timetable')}
          />
        )}

        {/* Tab 2: Timetable */}
        {currentTab === 'timetable' && (
          <RoutineTimeline
            activities={activities}
            currentMinutes={currentMinutes}
            theme={activeTheme}
            onToggleComplete={handleToggleComplete}
            onEditActivity={(act) => {
              setEditingActivity(act);
              setIsAddModalOpen(true);
            }}
            onDeleteActivity={handleDeleteActivity}
            onToggleLock={handleToggleLock}
            onOpenAddModal={() => {
              setEditingActivity(null);
              setIsAddModalOpen(true);
            }}
            onAdjustDincharya={handleAdjustDincharya}
          />
        )}

        {/* Tab 3: Help & Demo */}
        {currentTab === 'help' && (
          <HelpSection
            theme={activeTheme}
            onLoadDemoTemplate={handleLoadDemoTemplate}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer className={`border-t py-5 mt-auto transition-colors ${activeTheme.headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Dincharya</span>
            <span>· Smart Daily Routine Planner</span>
          </div>
          <p className="italic text-2xs">
            “Your routine changes with your life.” · ॥ राधावल्लभ श्री हरिवंश ॥
          </p>
        </div>
      </footer>

      {/* 5. Add / Edit Activity Modal */}
      <ActivityModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveActivity}
        editingActivity={editingActivity}
        theme={activeTheme}
      />

      {/* 6. Activity Reminder Alert Banner */}
      <ReminderBanner
        activities={activities}
        currentMinutes={currentMinutes}
        remindersEnabled={remindersEnabled}
      />
    </div>
  );
}
