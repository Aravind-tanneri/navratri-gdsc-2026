import React from "react";
import { Link } from "react-router-dom";
import { ACCENT_LOOKUP } from "../data/days";
import { useGame } from "../context/GameContext";

export const DeviCard = ({ dayData }) => {
  const { isDayUnlocked, completedDays, dayScores, clues } = useGame();

  const isUnlocked = isDayUnlocked(dayData.day);
  const isCompleted = completedDays.includes(dayData.day);
  const accent = ACCENT_LOOKUP[dayData.accentKey] || ACCENT_LOOKUP.gold;
  const score = dayScores[dayData.day];
  const clue = clues[dayData.day];

  return (
    <div
      className={`relative rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-5 sm:p-6 group ${
        !isUnlocked
          ? "glass-card opacity-55 border-slate-800"
          : isCompleted
          ? `glass-card border ${accent.borderClass} ${accent.glowClass}`
          : "glass-card border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]"
      }`}
    >
      {/* Decorative gradient corner aura */}
      <div
        className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${accent.gradientClass} blur-2xl pointer-events-none group-hover:scale-125 transition-transform`}
      />

      {/* Top Header: Day Badge & Flower / Icon */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isCompleted
                ? `${accent.borderClass} ${accent.textClass} bg-black/40`
                : isUnlocked
                ? "border-amber-500/40 text-amber-300 bg-amber-500/10"
                : "border-slate-800 text-slate-400 bg-slate-900/60"
            }`}
          >
            Day {dayData.day}
          </span>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span title={`Sacred Flower: ${dayData.flower}`}>{dayData.icon}</span>
            <span className="hidden sm:inline font-sans text-[11px] truncate max-w-[100px]">
              {dayData.flower}
            </span>
          </div>
        </div>

        {/* Devi Name & Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
          {dayData.devi}
        </h3>
        
        <p className="text-xs text-amber-300/80 font-medium mt-0.5 mb-2">
          {dayData.title}
        </p>

        {/* Skill Tag */}
        <div className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 mb-3">
          <span>🛡️</span>
          <span className="font-mono">{dayData.skillTag}</span>
        </div>

        {/* Story teaser */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {dayData.story}
        </p>
      </div>

      {/* Bottom Status & CTA */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
        {isCompleted ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span>✓</span> Restored
              </span>
              <span className="text-amber-300 font-bold">{score} pts</span>
            </div>
            {clue && (
              <div className="text-[11px] font-mono text-slate-300 bg-black/50 px-2.5 py-1.5 rounded-lg border border-emerald-500/35 flex items-center justify-between gap-1 overflow-hidden shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                <span className="text-slate-400 shrink-0 text-[10px] uppercase">Clue:</span>
                <span className="text-emerald-300 font-bold truncate max-w-[160px]" title={clue}>
                  {clue}
                </span>
              </div>
            )}
            <Link
              to={`/day/${dayData.day}`}
              className={`w-full py-2 px-3 rounded-xl text-xs text-center font-medium transition-all ${accent.btnClass}`}
            >
              Review Challenge
            </Link>
          </div>
        ) : isUnlocked ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-amber-300/80 font-mono">
              <span className="animate-pulse flex items-center gap-1">
                <span>🔓</span> Ready
              </span>
              <span>100 pts</span>
            </div>
            <Link
              to={`/day/${dayData.day}`}
              className={`w-full py-2.5 px-3 rounded-xl text-xs text-center font-semibold transition-all shadow-md ${accent.btnClass}`}
            >
              Start Challenge →
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span>🔒</span> Locked
            </span>
            <span className="text-[11px]">
              {dayData.day === 9 ? "Finish Days 1-8" : `Complete Day ${dayData.day - 1}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
