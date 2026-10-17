import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { DAYS_DATA, ACCENT_LOOKUP } from "../data/days";
import { useGame } from "../context/GameContext";
import { HintButton } from "../components/HintButton";
import { ClueReveal } from "../components/ClueReveal";
import { LessonCard } from "../components/LessonCard";
import { triggerPartyPopper } from "../utils/confetti";
import toast from "react-hot-toast";

// Import all 9 challenges
import { Day1 } from "../challenges/Day1";
import { Day2 } from "../challenges/Day2";
import { Day3 } from "../challenges/Day3";
import { Day4 } from "../challenges/Day4";
import { Day5 } from "../challenges/Day5";
import { Day6 } from "../challenges/Day6";
import { Day7 } from "../challenges/Day7";
import { Day8 } from "../challenges/Day8";
import { Day9 } from "../challenges/Day9";

const CHALLENGE_COMPONENTS = {
  1: Day1,
  2: Day2,
  3: Day3,
  4: Day4,
  5: Day5,
  6: Day6,
  7: Day7,
  8: Day8,
  9: Day9,
};

export const Day = () => {
  const { n } = useParams();
  const dayNum = parseInt(n, 10);
  const navigate = useNavigate();

  const {
    isDayUnlocked,
    completedDays,
    completeDay,
    calculateDayScore,
    dayScores,
  } = useGame();

  const [showLessonCard, setShowLessonCard] = useState(false);

  const dayData = DAYS_DATA.find((d) => d.day === dayNum);

  if (!dayData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-bold text-rose-400 mb-2">Day Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">The specified day does not exist in the 9-day Navratri festival quest.</p>
        <Link to="/" className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm">
          Return to Quest Hub
        </Link>
      </div>
    );
  }

  const isUnlocked = isDayUnlocked(dayNum);
  const isCompleted = completedDays.includes(dayNum);
  const accent = ACCENT_LOOKUP[dayData.accentKey] || ACCENT_LOOKUP.gold;
  const currentScore = dayScores[dayNum] || calculateDayScore(dayNum);

  const ChallengeComponent = CHALLENGE_COMPONENTS[dayNum] || Day1;

  const handleChallengeSuccess = () => {
    triggerPartyPopper(accent.hex);
    completeDay(dayNum);
    toast.success(`Day ${dayNum} Restored! ${dayData.devi}'s blessing unlocked. 🪔`, {
      duration: 4500,
    });
  };

  // If locked, render lock gate
  if (!isUnlocked) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="glass-card p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl">
            🔒
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Node Locked • Sequential Defense
          </span>
          <h2 className="font-serif text-2xl font-bold text-slate-200">
            {dayData.devi}’s Power is Not Yet Accessible
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {dayNum === 9
              ? "Day 9 is the Grand System Reboot. You must successfully collect the forensic clues from Days 1 through 8 before unlocking the restoration matrix."
              : `You must restore Day ${dayNum - 1} before you can access this node.`}
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              ← Back to Quest Hub
            </Link>
            <Link
              to={`/day/${Math.max(1, dayNum - 1)}`}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md"
            >
              Go to Day {Math.max(1, dayNum - 1)} →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-amber-300">Quest</Link>
          <span>/</span>
          <span className="text-slate-200 font-bold">Day {dayData.day}</span>
        </div>

        <div className="flex items-center gap-4">
          <span>Est. Value: <strong className="text-amber-400 font-mono">{currentScore} pts</strong></span>
          <Link to="/scorecard" className="hover:text-amber-300 underline">
            Clue Book
          </Link>
        </div>
      </div>

      {/* Devi Header Banner with Sacred Accent Aura */}
      <div className={`relative glass-card rounded-3xl p-6 sm:p-8 border ${accent.borderClass} ${accent.glowClass} overflow-hidden`}>
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${accent.gradientClass} blur-3xl pointer-events-none`} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${accent.borderClass} ${accent.textClass} bg-black/40`}>
                Day {dayData.day} of 9
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono">
                Virtue: {dayData.skillTag}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Sacred Flower: {dayData.flower}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-100">
              {dayData.devi}
            </h1>
            <p className="font-serif text-sm sm:text-base text-amber-300/90 italic">
              {dayData.title} • {dayData.subtitle}
            </p>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/50 border border-slate-700 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
            {dayData.icon}
          </div>
        </div>

        {/* Narrative Context */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs sm:text-sm">
          <div className="md:col-span-8 text-slate-300 leading-relaxed">
            <strong className="text-amber-300 block mb-1 font-mono uppercase text-xs">
              Festival Mission Brief:
            </strong>
            {dayData.story}
          </div>
          <div className="md:col-span-4 bg-black/40 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Forensic Target Clue:
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono">
                {dayData.clueLabel}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Solves reveal permanent entries in your Clue Book.
            </div>
          </div>
        </div>
      </div>

      {/* If Day is Completed: Show Clue Reveal & Lesson Banner */}
      {isCompleted && (
        <ClueReveal
          dayData={dayData}
          earnedScore={currentScore}
          onShowLesson={() => setShowLessonCard(true)}
        />
      )}

      {/* Lesson Behind It Component */}
      {showLessonCard && (
        <LessonCard dayData={dayData} onDismiss={() => setShowLessonCard(false)} />
      )}

      {/* The Interactive Challenge Component */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-serif text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>⚡</span> Interactive Challenge Task
          </h3>
          {isCompleted && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              ✓ Solved (Review Mode)
            </span>
          )}
        </div>

        <ChallengeComponent dayData={dayData} onSuccess={handleChallengeSuccess} />
      </section>

      {/* Hint Button (costs 5 points) */}
      {!isCompleted && dayData.hint && (
        <section className="pt-2">
          <HintButton dayNumber={dayData.day} hintText={dayData.hint} />
        </section>
      )}

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs">
        {dayNum > 1 ? (
          <Link
            to={`/day/${dayNum - 1}`}
            className="text-slate-400 hover:text-slate-200 font-mono"
          >
            ← Previous (Day {dayNum - 1})
          </Link>
        ) : (
          <Link to="/" className="text-slate-400 hover:text-slate-200 font-mono">
            ← Home
          </Link>
        )}

        {dayNum < 9 && isCompleted && (
          <Link
            to={`/day/${dayNum + 1}`}
            className="text-amber-400 hover:text-amber-300 font-bold font-mono"
          >
            Next Day ({dayNum + 1}) →
          </Link>
        )}
      </div>

    </div>
  );
};
