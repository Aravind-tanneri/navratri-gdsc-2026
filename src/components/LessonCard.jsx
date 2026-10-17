import React from "react";
import { Link } from "react-router-dom";
import { ACCENT_LOOKUP } from "../data/days";

export const LessonCard = ({ dayData, onDismiss }) => {
  const accent = ACCENT_LOOKUP[dayData.accentKey] || ACCENT_LOOKUP.gold;
  const isFinalDay = dayData.day === 9;

  return (
    <div className="glass-card border border-amber-500/40 rounded-3xl p-6 sm:p-8 my-6 text-left shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-sm">
            💡
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              Tech & Security Insight • Day {dayData.day}
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100">
              {dayData.lessonTitle}
            </h3>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-200 text-lg p-1"
            title="Close"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
        <p>{dayData.lessonBody}</p>

        <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 flex items-start gap-3">
          <span className="text-xl">🛡️</span>
          <div className="text-xs">
            <strong className="text-amber-300 block mb-0.5">GDSC Developer Best Practice:</strong>
            <span className="text-slate-400">
              When building modern applications, always assume potential compromise: apply defense-in-depth, validate inputs at server boundaries, and foster psychological safety so teammates report suspected breaches immediately.
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-mono text-slate-400">
          Devi: <span className="text-slate-200 font-semibold">{dayData.devi}</span> • Virtue: <span className="text-amber-300">{dayData.skillTag}</span>
        </span>

        <div className="flex items-center gap-2">
          {!isFinalDay ? (
            <Link
              to={`/day/${dayData.day + 1}`}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:from-amber-300 hover:to-rose-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-300/60 hover:scale-105 active:scale-95 transition-all"
            >
              Continue to Day {dayData.day + 1} →
            </Link>
          ) : (
            <Link
              to="/final"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 shadow-[0_0_22px_rgba(52,211,153,0.5)] border border-emerald-300/60 hover:scale-105 active:scale-95 transition-all"
            >
              Restore Final System Matrix →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
