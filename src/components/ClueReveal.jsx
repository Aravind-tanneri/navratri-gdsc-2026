import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ACCENT_LOOKUP } from "../data/days";
import { triggerPartyPopper } from "../utils/confetti";

export const ClueReveal = ({ dayData, earnedScore, onShowLesson }) => {
  const accent = ACCENT_LOOKUP[dayData.accentKey] || ACCENT_LOOKUP.gold;
  const isFinalDay = dayData.day === 9;

  // Trigger party popper confetti explosion when clue reveal mounts
  useEffect(() => {
    triggerPartyPopper(accent.hex);
  }, [accent.hex]);

  return (
    <div className="relative glass-card border-2 border-amber-400/80 p-6 sm:p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(245,158,11,0.4)] animate-fade-in overflow-hidden my-6">
      
      {/* Background Diya / Festive Glow Ray */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-amber-500/25 blur-3xl pointer-events-none" />

      {/* Flanking Floating Party Poppers */}
      <div className="absolute top-4 left-6 text-2xl sm:text-3xl animate-[float_3s_ease-in-out_infinite] select-none pointer-events-none">
        🎉
      </div>
      <div className="absolute top-4 right-6 text-2xl sm:text-3xl animate-[float_3s_ease-in-out_infinite_alternate] select-none pointer-events-none">
        🎊
      </div>

      {/* Auspicious Icon & Badge */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.7)] mb-3 animate-bounce">
          <div className="w-full h-full bg-[#120524] rounded-2xl flex items-center justify-center text-3xl">
            🪔
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 mb-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <span className="text-sm">🎉</span>
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-300 uppercase">
            LEVEL RESTORED • JAI MATA DI
          </span>
          <span className="text-sm">🎉</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-100">
          {dayData.devi} Blessed Your Quest!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-1">
          You conquered the challenge and cleansed the compromised system partition.
        </p>

        {/* Score & Clue Box */}
        <div className="my-6 w-full max-w-md bg-black/60 rounded-2xl p-4 border border-amber-500/40 text-left space-y-3">
          <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-mono">Day {dayData.day} Score Earned:</span>
            <span className="text-amber-400 font-mono font-bold text-sm">
              +{earnedScore} pts
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 block">
              Forensic Clue Discovered (Saved to Clue Book):
            </span>
            <div className="mt-1 flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-xl border border-amber-500/30">
              <span className="text-xs text-slate-400 font-mono">{dayData.clueLabel}:</span>
              <span className="text-sm font-bold font-mono text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                {dayData.clueValue}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3.5 justify-center items-center">
          <button
            onClick={() => triggerPartyPopper(accent.hex)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            title="Pop festive confetti cannons again"
          >
            <span>🎉</span>
            <span>Pop Confetti Again</span>
          </button>

          <button
            onClick={onShowLesson}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900/90 hover:bg-white/10 text-slate-100 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.2)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span>📖</span>
            <span>Read Tech Lesson</span>
          </button>

          {!isFinalDay ? (
            <Link
              to={`/day/${dayData.day + 1}`}
              className="px-7 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:from-amber-300 hover:to-rose-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-amber-300/60 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next Day ({dayData.day + 1}) →</span>
            </Link>
          ) : (
            <Link
              to="/final"
              className="px-7 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 shadow-[0_0_28px_rgba(52,211,153,0.6)] border border-emerald-300/60 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Proceed to Grand System Reboot →</span>
            </Link>
          )}

          <Link
            to="/scorecard"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-300 hover:bg-white/5 border border-transparent hover:border-slate-800 transition-all flex items-center gap-1.5"
          >
            View Clue Book
          </Link>
        </div>

      </div>
    </div>
  );
};
