import {
  Briefcase,
  BookOpen,
  Dumbbell,
  Sparkles,
  Utensils,
  Moon,
  Compass,
  Coffee,
  Palette,
  LucideIcon,
} from 'lucide-react';
import { ActivityCategory } from '../types/routine';

export interface CategoryInfo {
  label: string;
  icon: LucideIcon;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
}

export const CATEGORY_MAP: Record<ActivityCategory, CategoryInfo> = {
  work: {
    label: 'Work & Professional',
    icon: Briefcase,
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    dotColor: 'bg-indigo-600',
  },
  study: {
    label: 'Study & Learning',
    icon: BookOpen,
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeText: 'text-blue-700 dark:text-blue-300',
    dotColor: 'bg-blue-600',
  },
  fitness: {
    label: 'Gym & Fitness',
    icon: Dumbbell,
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    dotColor: 'bg-rose-600',
  },
  spiritual: {
    label: 'Spiritual & Meditation',
    icon: Sparkles,
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    dotColor: 'bg-amber-600',
  },
  meals: {
    label: 'Nutrition & Meals',
    icon: Utensils,
    badgeBg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeText: 'text-orange-700 dark:text-orange-300',
    dotColor: 'bg-orange-600',
  },
  sleep: {
    label: 'Sleep & Rest',
    icon: Moon,
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeText: 'text-purple-700 dark:text-purple-300',
    dotColor: 'bg-purple-600',
  },
  travel: {
    label: 'Travel & Commute',
    icon: Compass,
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-700 dark:text-slate-300',
    dotColor: 'bg-slate-600',
  },
  personal: {
    label: 'Personal & Breaks',
    icon: Coffee,
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeText: 'text-teal-700 dark:text-teal-300',
    dotColor: 'bg-teal-600',
  },
  hobby: {
    label: 'Hobby & Creative',
    icon: Palette,
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    dotColor: 'bg-emerald-600',
  },
};
