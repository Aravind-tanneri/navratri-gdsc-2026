import React from "react";
import { Link } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { CONFIG } from "../config";
import { DAYS_DATA } from "../data/days";
import { Day9 } from "../challenges/Day9";

export const Final = () => {
  const { completedDays, completeDay } = useGame();

  const missingDays = [1, 2, 3, 4, 5, 6, 7, 8].filter((d) => !completedDays.includes(d));
  const isUnlocked = CONFIG.UNLOCK_ALL || missingDays.length === 0;

  const day9Data = DAYS_DATA.find((d) => d.day === 9);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-amber-300">Quest</Link>
          <span>/</span>
          <span className="text-purple-300 font-bold">Day 9: Grand Restoration</span>
        </div>
        <Link to="/scorecard" className="hover:text-amber-300 underline">
          View Clue Book
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <span>🪔</span> Grand Synthesis Node
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-100">
          Restore the Navratri Utsav
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Maa Siddhidatri confers the nine divine siddhis. Gather the eight discovered forensic clues from Days 1 through 8 to initialize the master firewall reboot.
        </p>
      </div>

      {/* If Days 1-8 are not all complete: show locked state */}
      {!isUnlocked ? (
        <div className="glass-card max-w-2xl mx-auto p-8 rounded-3xl border border-purple-500/30 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl">
            🔒
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
              Quarantine Enforced • {missingDays.length} Missing Clues
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-200 mt-1">
              Complete Days 1 through 8 to Unlock
            </h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              The Restoration Matrix requires exact forensic parameters extracted from each daily node. You cannot guess the parameters without solving earlier challenges.
            </p>
          </div>

          {/* Pending Days Quick Links */}
          <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 text-left space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Pending Days Required for Synthesis:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {missingDays.map((d) => (
                <Link
                  key={d}
                  to={`/day/${d}`}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-amber-500/15 border border-slate-800 hover:border-amber-500/40 text-center transition-all group"
                >
                  <div className="text-xs font-bold text-slate-300 group-hover:text-amber-300">
                    Day {d}
                  </div>
                  <div className="text-[10px] text-rose-400 font-mono mt-0.5">Solve Now →</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              to={`/day/${missingDays[0]}`}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md inline-block"
            >
              Resume at Day {missingDays[0]} →
            </Link>
          </div>
        </div>
      ) : (
        /* Unlocked: Render Day 9 Challenge */
        <Day9 dayData={day9Data} onSuccess={() => completeDay(9)} />
      )}

    </div>
  );
};
