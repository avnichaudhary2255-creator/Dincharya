import { ThemeMode } from '../types/routine';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  icon: string;
  bodyClass: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  primaryBtn: string;
  accentText: string;
  tagColor: string;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Light',
    icon: '🌤',
    bodyClass: 'bg-slate-50 text-slate-900',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    headerBg: 'bg-white/95 border-slate-200',
    primaryBtn: 'bg-slate-900 text-white hover:bg-slate-800',
    accentText: 'text-amber-700',
    tagColor: 'bg-slate-100 text-slate-700',
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    icon: '🌙',
    bodyClass: 'bg-slate-950 text-slate-100 dark',
    cardBg: 'bg-slate-900',
    cardBorder: 'border-slate-800',
    headerBg: 'bg-slate-900/95 border-slate-800',
    primaryBtn: 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold',
    accentText: 'text-amber-400',
    tagColor: 'bg-slate-800 text-slate-300',
  },
  calm: {
    id: 'calm',
    name: 'Calm Sage',
    icon: '🌿',
    bodyClass: 'bg-emerald-50/40 text-emerald-950',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-200/70',
    headerBg: 'bg-white/95 border-emerald-200',
    primaryBtn: 'bg-emerald-800 text-white hover:bg-emerald-900',
    accentText: 'text-emerald-700',
    tagColor: 'bg-emerald-100/70 text-emerald-800',
  },
  spiritual: {
    id: 'spiritual',
    name: 'Spiritual',
    icon: '🌸',
    bodyClass: 'bg-amber-50/40 text-amber-950',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-200',
    headerBg: 'bg-white/95 border-amber-200',
    primaryBtn: 'bg-amber-800 text-amber-50 hover:bg-amber-900',
    accentText: 'text-amber-800',
    tagColor: 'bg-amber-100 text-amber-900',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    icon: '✨',
    bodyClass: 'bg-neutral-50 text-neutral-900 font-sans',
    cardBg: 'bg-white',
    cardBorder: 'border-neutral-300',
    headerBg: 'bg-white border-neutral-300',
    primaryBtn: 'bg-black text-white hover:bg-neutral-800',
    accentText: 'text-neutral-900 font-bold',
    tagColor: 'bg-neutral-200 text-neutral-800',
  },
};
