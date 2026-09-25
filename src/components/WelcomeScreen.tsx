import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [fadingOut, setFadingOut] = useState(false);

  const handleStart = () => {
    setFadingOut(true);
    setTimeout(() => {
      onEnter();
    }, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-radial from-amber-50/90 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black transition-opacity duration-500 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background ambient spiritual glow */}
      <div className="absolute w-96 h-96 rounded-full bg-amber-400/10 dark:bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full text-center relative z-10 space-y-8 animate-slide-up">
        {/* Sacred Sanskrit Inscription */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 mb-2 border border-amber-300/40 dark:border-amber-500/20">
            <span className="text-2xl select-none">🌸</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-amber-900 dark:text-amber-200 drop-shadow-xs font-serif">
            ॥ राधावल्लभ श्री हरिवंश ॥
          </h1>

          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent my-3" />

          <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 tracking-wide">
            दिनचर्या · Smart Daily Routine Planner
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            “Your routine changes with your life.”
          </p>
        </div>

        {/* Quiet spiritual card */}
        <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-amber-200/60 dark:border-amber-500/20 shadow-lg text-xs text-slate-600 dark:text-slate-400 space-y-3">
          <p className="leading-relaxed">
            Every day is a canvas of mindful action and discipline. Build a personal routine
            where fixed commitments stay protected and flexible time balances effortlessly.
          </p>
          <div className="flex items-center justify-center gap-2 text-2xs text-amber-800 dark:text-amber-400 font-medium">
            <span>Harmonious Balance</span>
            <span aria-hidden="true">·</span>
            <span>Zero Overlaps</span>
            <span aria-hidden="true">·</span>
            <span>Dynamic Adjustment</span>
          </div>
        </div>

        {/* Enter Action */}
        <div className="pt-2">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-amber-50 font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 mx-auto group cursor-pointer"
          >
            <span>Enter My Dincharya</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
