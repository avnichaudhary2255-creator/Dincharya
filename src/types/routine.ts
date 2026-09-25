export type ActivityCategory =
  | 'work'
  | 'study'
  | 'fitness'
  | 'spiritual'
  | 'meals'
  | 'sleep'
  | 'travel'
  | 'personal'
  | 'hobby';

export type ActivityType = 'fixed' | 'flexible';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type ThemeMode = 'light' | 'dark' | 'calm' | 'spiritual' | 'minimal';

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  type: ActivityType;
  startTime: string; // "HH:MM" 24h
  endTime: string;   // "HH:MM" 24h
  durationMinutes: number;
  isLocked: boolean; // Cannot be moved by smart adjust
  priority: PriorityLevel;
  repeatDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  hasReminder: boolean;
  notes?: string;
  isCompleted?: boolean;
}

export interface ScheduleConflict {
  id: string;
  activity1: Activity;
  activity2: Activity;
  overlapMinutes: number;
  message: string;
}

export interface SmartAdjustResult {
  activities: Activity[];
  adjustmentsMade: string[];
  conflicts: ScheduleConflict[];
  totalOccupiedMinutes: number;
  totalFreeMinutes: number;
  workStudyMinutes: number;
}
