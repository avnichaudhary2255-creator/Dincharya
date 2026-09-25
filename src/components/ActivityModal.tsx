import React, { useState, useEffect } from 'react';
import { X, Lock, ArrowUpDown, Bell, BellOff, Clock } from 'lucide-react';
import {
  Activity,
  ActivityCategory,
  ActivityType,
  PriorityLevel,
} from '../types/routine';
import {
  calculateDuration,
  addMinutesToTime,
  format12Hour,
  formatDuration,
} from '../utils/timeUtils';
import { CATEGORY_MAP } from '../utils/categoryMeta';
import { ThemeConfig } from '../utils/theme';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  editingActivity?: Activity | null;
  theme: ThemeConfig;
}

const WEEKDAYS = [
  { label: 'Sun', index: 0 },
  { label: 'Mon', index: 1 },
  { label: 'Tue', index: 2 },
  { label: 'Wed', index: 3 },
  { label: 'Thu', index: 4 },
  { label: 'Fri', index: 5 },
  { label: 'Sat', index: 6 },
];

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingActivity,
  theme,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('work');
  const [type, setType] = useState<ActivityType>('fixed');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [durationMinutes, setDurationMinutes] = useState(480);
  const [isLocked, setIsLocked] = useState(false);
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [repeatDays, setRepeatDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [hasReminder, setHasReminder] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingActivity) {
      setTitle(editingActivity.title);
      setCategory(editingActivity.category);
      setType(editingActivity.type);
      setStartTime(editingActivity.startTime);
      setEndTime(editingActivity.endTime);
      setDurationMinutes(editingActivity.durationMinutes);
      setIsLocked(editingActivity.isLocked);
      setPriority(editingActivity.priority);
      setRepeatDays(editingActivity.repeatDays || [0, 1, 2, 3, 4, 5, 6]);
      setHasReminder(editingActivity.hasReminder);
      setNotes(editingActivity.notes || '');
    } else {
      setTitle('');
      setCategory('work');
      setType('fixed');
      setStartTime('09:00');
      setEndTime('17:00');
      setDurationMinutes(480);
      setIsLocked(false);
      setPriority('high');
      setRepeatDays([1, 2, 3, 4, 5]);
      setHasReminder(true);
      setNotes('');
    }
  }, [editingActivity, isOpen]);

  // Handle start time change -> recalculate duration
  const handleStartTimeChange = (newStart: string) => {
    setStartTime(newStart);
    const dur = calculateDuration(newStart, endTime);
    setDurationMinutes(dur);
  };

  // Handle end time change -> recalculate duration
  const handleEndTimeChange = (newEnd: string) => {
    setEndTime(newEnd);
    const dur = calculateDuration(startTime, newEnd);
    setDurationMinutes(dur);
  };

  // Handle duration change -> update end time
  const handleDurationChange = (newDur: number) => {
    const validDur = Math.max(5, newDur);
    setDurationMinutes(validDur);
    const newEnd = addMinutesToTime(startTime, validDur);
    setEndTime(newEnd);
  };

  const toggleDay = (dayIndex: number) => {
    if (repeatDays.includes(dayIndex)) {
      if (repeatDays.length > 1) {
        setRepeatDays(repeatDays.filter((d) => d !== dayIndex));
      }
    } else {
      setRepeatDays([...repeatDays, dayIndex].sort());
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const activityData: Activity = {
      id: editingActivity ? editingActivity.id : `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      category,
      type,
      startTime,
      endTime,
      durationMinutes: durationMinutes || calculateDuration(startTime, endTime) || 60,
      isLocked: type === 'fixed' ? true : isLocked,
      priority,
      repeatDays,
      hasReminder,
      notes: notes.trim(),
      isCompleted: editingActivity ? editingActivity.isCompleted : false,
    };

    onSave(activityData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg rounded-2xl border ${theme.cardBg} ${theme.cardBorder} shadow-2xl overflow-y-auto max-h-[92vh] text-slate-900 dark:text-slate-100 p-6 space-y-5`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold">
            {editingActivity ? 'Edit Activity' : 'Add New Activity to Dincharya'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Activity Name */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Activity Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Work, Study, Gym, Reading, Meditation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              {Object.entries(CATEGORY_MAP).map(([catKey, meta]) => (
                <option key={catKey} value={catKey}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fixed vs Flexible Toggle */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Schedule Type (Fixed vs Flexible)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('fixed');
                  setIsLocked(true);
                }}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  type === 'fixed'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs dark:bg-amber-600 dark:border-amber-600'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <Lock className={`w-4 h-4 mt-0.5 ${type === 'fixed' ? 'text-amber-400' : 'text-slate-400'}`} />
                <div>
                  <p className="font-bold">Fixed Activity</p>
                  <p className={`text-2xs mt-0.5 ${type === 'fixed' ? 'text-slate-300 dark:text-amber-100' : 'text-slate-500'}`}>
                    Cannot automatically move (Work, Travel, Sleep).
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('flexible');
                  setIsLocked(false);
                }}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  type === 'flexible'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <ArrowUpDown className={`w-4 h-4 mt-0.5 ${type === 'flexible' ? 'text-blue-200' : 'text-slate-400'}`} />
                <div>
                  <p className="font-bold">Flexible Activity</p>
                  <p className={`text-2xs mt-0.5 ${type === 'flexible' ? 'text-blue-100' : 'text-slate-500'}`}>
                    Can be shifted by smart engine (Study, Gym, Reading).
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Timings & Duration */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 font-mono text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none"
                />
                <span className="text-2xs font-mono text-slate-500 mt-0.5 block">
                  {format12Hour(startTime)}
                </span>
              </div>

              <div>
                <label className="block text-2xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 font-mono text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none"
                />
                <span className="text-2xs font-mono text-slate-500 mt-0.5 block">
                  {format12Hour(endTime)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-2xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Duration:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={720}
                  step={5}
                  value={durationMinutes}
                  onChange={(e) => handleDurationChange(parseInt(e.target.value, 10) || 30)}
                  className="w-20 px-2 py-1 font-mono text-xs text-right rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 text-2xs">
                  mins ({formatDuration(durationMinutes)})
                </span>
              </div>
            </div>
          </div>

          {/* Priority & Lock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <input
                  type="checkbox"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span className="font-semibold text-xs flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Lock Activity
                </span>
              </label>
            </div>
          </div>

          {/* Repeat Days */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Repeat Days
            </label>
            <div className="flex gap-1.5 justify-between">
              {WEEKDAYS.map((day) => {
                const isSelected = repeatDays.includes(day.index);
                return (
                  <button
                    key={day.index}
                    type="button"
                    onClick={() => toggleDay(day.index)}
                    className={`flex-1 py-1.5 text-2xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reminder Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              {hasReminder ? (
                <Bell className="w-4 h-4 text-amber-600" />
              ) : (
                <BellOff className="w-4 h-4 text-slate-400" />
              )}
              <div>
                <p className="font-semibold text-xs">Activity Reminders</p>
                <p className="text-2xs text-slate-500">Alert 15 mins prior to activity</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHasReminder(!hasReminder)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                hasReminder
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {hasReminder ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Notes / Focus Goals (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Finish team sprint review, or 20 pushups and core workout"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs cursor-pointer ${theme.primaryBtn}`}
            >
              {editingActivity ? 'Update Activity' : 'Add to Dincharya'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
