import React from 'react';
import {
  Clock,
  Calendar,
  HelpCircle,
  Bell,
  BellOff,
  Sparkles,
  Plus,
  RotateCcw,
  Palette,
} from 'lucide-react';
import { ThemeMode } from '../types/routine';
import { THEMES, ThemeConfig } from '../utils/theme';

interface NavbarProps {
  currentTab: 'dashboard' | 'timetable' | 'help';
  setCurrentTab: (tab: 'dashboard' | 'timetable' | 'help') => void;
  theme: ThemeConfig;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  remindersEnabled: boolean;
  setRemindersEnabled: (enabled: boolean) => void;
  canUndo: boolean;
  onUndo: () => void;
  onAdjustDincharya: () => void;
  onOpenAddModal: () => void;
  onReopenWelcome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  theme,
  themeMode,
  setThemeMode,
  remindersEnabled,
  setRemindersEnabled,
  canUndo,
  onUndo,
  onAdjustDincharya,
  onOpenAddModal,
  onReopenWelcome,
}) => {
  return (
    <header className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${theme.headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="text-left flex items-center gap-2.5 focus:outline-none cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                🌸
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight block">
                  Dincharya
                </span>
                <span className="text-2xs text-slate-500 dark:text-slate-400 -mt-1 block font-medium">
                  Smart Routine Planner
                </span>
              </div>
            </button>

            {/* Sacred Inscription button to reopen blessing */}
            <button
              onClick={onReopenWelcome}
              className="hidden lg:inline-flex items-center text-2xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-colors font-medium border border-amber-300/30 cursor-pointer"
              title="View ॥ राधावल्लभ श्री हरिवंश ॥ blessing"
            >
              ॥ श्री हरिवंश ॥
            </button>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('timetable')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'timetable'
                  ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Timetable</span>
            </button>

            <button
              onClick={() => setCurrentTab('help')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'help'
                  ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help & Demo</span>
            </button>
          </nav>

          {/* Right Actions: Undo, Adjust, Theme, Reminders, Add */}
          <div className="flex items-center gap-2">
            {/* Undo button */}
            {canUndo && (
              <button
                onClick={onUndo}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
                title="Undo last smart adjustment"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Undo</span>
              </button>
            )}

            {/* Adjust My Dincharya Primary Button */}
            <button
              onClick={onAdjustDincharya}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Automatically recalculate flexible activities around fixed commitments"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Adjust My Dincharya</span>
              <span className="sm:hidden">Adjust</span>
            </button>

            {/* Theme Selector Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
                className="px-2 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                title="Select aesthetic theme"
              >
                {Object.values(THEMES).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reminders Toggle */}
            <button
              onClick={() => setRemindersEnabled(!remindersEnabled)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                remindersEnabled
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-600'
              }`}
              title={remindersEnabled ? 'Reminders ON' : 'Reminders OFF'}
            >
              {remindersEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>

            {/* Add Activity Button */}
            <button
              onClick={onOpenAddModal}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs ${theme.primaryBtn}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Add Activity</span>
              <span className="sm:hidden">+ Add</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1 rounded-lg ${
              currentTab === 'dashboard'
                ? 'bg-amber-500/10 text-amber-800 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('timetable')}
            className={`px-3 py-1 rounded-lg ${
              currentTab === 'timetable'
                ? 'bg-amber-500/10 text-amber-800 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Timetable
          </button>
          <button
            onClick={() => setCurrentTab('help')}
            className={`px-3 py-1 rounded-lg ${
              currentTab === 'help'
                ? 'bg-amber-500/10 text-amber-800 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Help & Demo
          </button>
        </div>
      </div>
    </header>
  );
};
