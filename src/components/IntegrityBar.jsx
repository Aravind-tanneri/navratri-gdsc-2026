import React from "react";
import { useGame } from "../context/GameContext";

export const IntegrityBar = () => {
  const { systemIntegrity, completedDays } = useGame();

  return (
    <div className="w-full glass-card p-4 sm:p-6 rounded-2xl border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.12)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg">
            ⚡
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              System Restoration Matrix
              <span className="text-xs font-mono font-normal text-amber-300 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                {completedDays.length} / 9 Powers Restored
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Collect divine cryptographic keys across the 9 days to bring defense telemetry back to 100%.
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-2 self-end sm:self-auto">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Integrity:</span>
          <span
            className={`text-2xl sm:text-3xl font-mono font-black ${
              systemIntegrity === 100
                ? "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                : "text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]"
            }`}
          >
            {systemIntegrity}%
          </span>
        </div>
      </div>

      {/* 9-Segment Progress Bar */}
      <div className="relative w-full h-4 sm:h-5 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          style={{ width: `${Math.max(5, systemIntegrity)}%` }}
        />
        {/* Subtle segment markers for the 9 days */}
        <div className="absolute inset-0 grid grid-cols-9 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`border-r border-slate-900/60 last:border-r-0 flex items-center justify-center`}
            />
          ))}
        </div>
      </div>

      {/* Day Mini Indicators */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2 mt-3 pt-2 border-t border-slate-800/80">
        {Array.from({ length: 9 }).map((_, i) => {
          const dayNum = i + 1;
          const isDone = completedDays.includes(dayNum);
          return (
            <div
              key={dayNum}
              className={`text-center py-1 rounded text-[10px] font-mono transition-all ${
                isDone
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  : "bg-slate-900/40 text-slate-400 border border-slate-800"
              }`}
            >
              <div className="hidden sm:block">Day {dayNum}</div>
              <div className="sm:hidden font-bold">{dayNum}</div>
              <div className="text-[9px] mt-0.5">{isDone ? "✓" : "○"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
