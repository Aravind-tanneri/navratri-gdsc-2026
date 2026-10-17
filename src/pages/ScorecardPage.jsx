import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DAYS_DATA, ACCENT_LOOKUP } from "../data/days";
import { useGame } from "../context/GameContext";
import { autoSubmitScoreToGoogleForm } from "../utils/googleForm";
import toast from "react-hot-toast";

export const ScorecardPage = () => {
  const {
    completedDays,
    dayScores,
    hintsUsed,
    wrongAttempts,
    clues,
    totalScore,
    totalTimeSeconds,
    systemIntegrity,
    playerName,
    resetProgress,
    verificationToken,
  } = useGame();

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAutoSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting verified score to GDSC Sheet...", { id: "scorecard-submit" });
    const res = await autoSubmitScoreToGoogleForm({
      name: playerName || "Anonymous Defender",
      score: totalScore,
      timeSeconds: totalTimeSeconds,
      token: verificationToken,
    });
    setIsSubmitting(false);
    if (res.success) {
      if (res.alreadySubmitted) {
        toast.success("Score is already safely recorded in GDSC standings! ✨", { id: "scorecard-submit" });
      } else {
        toast.success("Score & Token recorded to Google Sheet! 🚀", { id: "scorecard-submit" });
      }
    } else {
      toast.error(res.message, { id: "scorecard-submit" });
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem < 10 ? "0" : ""}${rem}s`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
            <span>📜</span> Forensic Telemetry & Valor Records
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-100">
            Nine Powers Scorecard & Clue Book
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Squad Call-Sign: <strong className="text-slate-200">{playerName || "Anonymous Defender"}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-xs font-medium glass-card hover:bg-white/10 text-slate-300 border border-slate-700"
          >
            ← Return to Quest
          </Link>
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-950/40 text-rose-300 border border-rose-500/40 hover:bg-rose-900/40 cursor-pointer"
          >
            ↺ Reset Quest Progress
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border-amber-500/30">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Score</span>
          <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
            {totalScore} <span className="text-xs font-normal text-slate-400">PTS</span>
          </span>
        </div>

        <div className="glass-card p-4 rounded-2xl border-amber-500/30">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">System Integrity</span>
          <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
            {systemIntegrity}%
          </span>
        </div>

        <div className="glass-card p-4 rounded-2xl border-amber-500/30">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Powers Restored</span>
          <span className="text-2xl sm:text-3xl font-mono font-black text-purple-400">
            {completedDays.length} <span className="text-xs font-normal text-slate-400">/ 9</span>
          </span>
        </div>

        <div className="glass-card p-4 rounded-2xl border-amber-500/30">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Quest Time</span>
          <span className="text-2xl sm:text-3xl font-mono font-black text-sky-400">
            {formatTime(totalTimeSeconds)}
          </span>
        </div>
      </div>

      {/* Official Cryptographic Verification Token */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-indigo-500/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white p-1 border border-amber-400/40 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
            <img src="/gdsc-logo.png" alt="GDSC NIT AP" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                Official Verification Token
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-semibold">
                SEALED & AUTHENTICATED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Submit this cryptographic hash to GDSC NIT AP organizers to verify authentic score & elapsed time.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <code className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-amber-400/50 text-amber-300 font-mono font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            {verificationToken}
          </code>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(verificationToken);
                setCopiedToken(true);
                toast.success("Verification token copied! 🛡️");
                setTimeout(() => setCopiedToken(false), 2000);
              }
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer active:scale-95 transition-all"
          >
            {copiedToken ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleAutoSubmit}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)] border border-emerald-300/60 cursor-pointer active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
            title="Automatically send score & token to the GDSC Google Sheet"
          >
            <span>⚡</span>
            <span>{isSubmitting ? "Submitting..." : "Auto-Submit"}</span>
          </button>
        </div>
      </div>

      {/* 9 Lotus / Diya Powers Lighting Grid */}
      <section className="space-y-4">
        <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>🪔</span> Nine Divine Powers Altar
        </h2>
        <p className="text-xs text-slate-400">
          Each lotus flame lights up as the respective Devi's virtue and cryptographic key are restored.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-3 sm:gap-2">
          {DAYS_DATA.map((dayData) => {
            const isDone = completedDays.includes(dayData.day);
            const accent = ACCENT_LOOKUP[dayData.accentKey] || ACCENT_LOOKUP.gold;

            return (
              <div
                key={dayData.day}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  isDone
                    ? `glass-card border ${accent.borderClass} ${accent.glowClass}`
                    : "glass-card opacity-40 border-slate-800"
                }`}
              >
                <div
                  className={`text-2xl sm:text-3xl mb-1 ${
                    isDone ? "animate-[diya-flicker_2s_infinite_alternate]" : "grayscale"
                  }`}
                  title={dayData.devi}
                >
                  {isDone ? "🪔" : "🪷"}
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-200">
                  Day {dayData.day}
                </span>
                <span className="text-[9px] text-slate-400 truncate max-w-[65px] hidden sm:block">
                  {dayData.devi.replace("Maa ", "")}
                </span>
                <span className="text-[9px] font-mono mt-1 text-amber-300">
                  {dayScores[dayData.day] ? `${dayScores[dayData.day]}pt` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* The Clue Book (Collected Evidence Matrix) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>📜</span> The Official Clue Book
            </h2>
            <p className="text-xs text-slate-400">
              Gathered forensic evidence required to solve Day 9's Grand Restoration Matrix.
            </p>
          </div>

          <Link
            to="/final"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-amber-500 text-slate-950 shadow-md hover:scale-105 transition-all"
          >
            Go to Day 9 Final Unlock →
          </Link>
        </div>

        <div className="glass-card rounded-2xl border border-amber-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[720px]">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="p-3 sm:p-4">Day & Devi</th>
                  <th className="p-3 sm:p-4">Virtue / Tech Focus</th>
                  <th className="p-3 sm:p-4">Clue Category</th>
                  <th className="p-3 sm:p-4">Discovered Parameter</th>
                  <th className="p-3 sm:p-4 text-center">Score</th>
                  <th className="p-3 sm:p-4 text-center">Hints / Tries</th>
                  <th className="p-3 sm:p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {DAYS_DATA.map((dayData) => {
                  const isDone = completedDays.includes(dayData.day);
                  const clueVal = clues[dayData.day];
                  const score = dayScores[dayData.day];
                  const hintUsed = hintsUsed[dayData.day];
                  const wrongs = wrongAttempts[dayData.day] || 0;

                  return (
                    <tr
                      key={dayData.day}
                      className={isDone ? "hover:bg-white/5" : "opacity-45 bg-black/20"}
                    >
                      <td className="p-3 sm:p-4 font-medium text-slate-200 whitespace-nowrap">
                        <span className="font-mono text-amber-400 mr-2">D{dayData.day}</span>
                        {dayData.devi}
                      </td>
                      <td className="p-3 sm:p-4 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                        {dayData.skillTag}
                      </td>
                      <td className="p-3 sm:p-4 font-mono text-slate-400 uppercase text-[11px] whitespace-nowrap">
                        {dayData.clueLabel}
                      </td>
                      <td className="p-3 sm:p-4 font-mono">
                        {isDone ? (
                          <span className="clue-badge text-xs">
                            {clueVal}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic text-[11px] whitespace-nowrap">[Power Offline]</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-center font-mono font-bold text-amber-400">
                        {score ? `${score} pts` : "—"}
                      </td>
                      <td className="p-3 sm:p-4 text-center text-slate-400 font-mono text-[11px]">
                        {hintUsed ? "💡 -5" : "No hint"} • {wrongs} err
                      </td>
                      <td className="p-3 sm:p-4 text-right">
                        <Link
                          to={`/day/${dayData.day}`}
                          className="text-amber-400 hover:text-amber-300 font-mono text-[11px] underline"
                        >
                          {isDone ? "Review" : "Solve"}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Reset Progress Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-sm w-full p-6 rounded-2xl border border-rose-500/50 text-center space-y-4">
            <div className="text-3xl">⚠️</div>
            <h3 className="text-lg font-bold text-slate-100 font-serif">Reset Clue Book?</h3>
            <p className="text-xs text-slate-400">
              This action will reset your Scorecard, purge collected clues, and return system integrity to 0%. Are you sure?
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowConfirmReset(false);
                  toast.error("Quest progress and clues reset! ↺");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white"
              >
                Reset All Progress
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
