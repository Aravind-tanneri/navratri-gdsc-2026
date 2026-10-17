import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import toast from "react-hot-toast";

export const HintButton = ({ dayNumber, hintText }) => {
  const { hintsUsed, useHint } = useGame();
  const isUsed = !!hintsUsed[dayNumber];
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReveal = () => {
    useHint(dayNumber);
    setShowConfirm(false);
    toast("💡 Divine hint revealed (-5 pts)", {
      icon: "💡",
      style: {
        border: "1px solid rgba(245, 158, 11, 0.4)",
      },
    });
  };

  return (
    <div className="w-full">
      {!isUsed ? (
        <div>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/10 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-400/50 hover:border-amber-300 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:shadow-[0_0_18px_rgba(245,158,11,0.35)] transition-all cursor-pointer active:scale-95"
            >
              <span className="text-sm">💡</span>
              <span>Request Divine Hint (-5 pts)</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <span className="text-amber-200 font-medium">
                Using this hint will deduct 5 points from your Day {dayNumber} score. Proceed?
              </span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReveal}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)] cursor-pointer"
                >
                  Confirm & Reveal
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-fade-in">
          <span className="text-base">💡</span>
          <div>
            <strong className="font-mono uppercase text-amber-400 block mb-0.5">
              Divine Hint (Active -5 Pts)
            </strong>
            <p className="leading-relaxed text-slate-200">{hintText}</p>
          </div>
        </div>
      )}
    </div>
  );
};
