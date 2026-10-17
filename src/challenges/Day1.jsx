import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { rateLimiter } from "../utils/security";

const CORRECT_ORDER = [
  "Plan requirements",
  "Design architecture",
  "Set up repo and version control",
  "Build features",
  "Add authentication and secure secrets",
  "Test",
  "Deploy and monitor",
];

const INITIAL_SCRAMBLE = [
  "Build features",
  "Deploy and monitor",
  "Plan requirements",
  "Add authentication and secure secrets",
  "Design architecture",
  "Test",
  "Set up repo and version control",
];

export const Day1 = ({ dayData, onSuccess }) => {
  const { recordWrongAttempt } = useGame();
  const [items, setItems] = useState(INITIAL_SCRAMBLE);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Move item up
  const moveUp = (index) => {
    if (index === 0) return;
    const next = [...items];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setItems(next);
    setErrorMessage("");
  };

  // Move item down
  const moveDown = (index) => {
    if (index === items.length - 1) return;
    const next = [...items];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setItems(next);
    setErrorMessage("");
  };

  // Native HTML5 Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const next = [...items];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(targetIndex, 0, moved);
    setItems(next);
    setDraggedIndex(null);
    setErrorMessage("");
  };

  const handleVerify = () => {
    // Rate limit: max 4 verification attempts per 6 seconds
    const limit = rateLimiter.checkLimit("day1_verify", 4, 6);
    if (!limit.allowed) {
      setErrorMessage(`Rate limit active: Please pause ${limit.retryAfterSeconds}s before submitting again.`);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    const isCorrect = items.every((val, idx) => val === CORRECT_ORDER[idx]);
    if (isCorrect) {
      setErrorMessage("");
      onSuccess();
    } else {
      recordWrongAttempt(1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      // Helpful feedback
      const firstMismatch = items.findIndex((val, idx) => val !== CORRECT_ORDER[idx]);
      setErrorMessage(
        `Order mismatch near step ${firstMismatch + 1}. Remember: Define requirements and architecture before creating repositories, and test thoroughly before deploying!`
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="glass-card p-4 sm:p-6 rounded-2xl border border-slate-700/80">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold font-serif text-slate-100 flex items-center gap-2">
            <span>🏔️</span> Secure SDLC Pipeline Assembler
          </h4>
          <span className="text-xs text-slate-400 font-mono">
            Drag or use ▲ ▼ buttons
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Reorder the 7 software lifecycle stages into the correct, secure chronological sequence.
        </p>

        {/* Pipeline List */}
        <div className={`space-y-2 ${isShaking ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
          {items.map((item, idx) => (
            <div
              key={item}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                draggedIndex === idx
                  ? "bg-amber-500/20 border-amber-400 opacity-60"
                  : "bg-slate-900/80 hover:bg-slate-800/80 border-slate-700/80 hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-black/60 border border-slate-700 font-mono text-xs font-bold text-amber-300 flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-200 select-none">
                  {item}
                </span>
              </div>

              {/* Up/Down buttons for mobile accessibility */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-amber-500/20 hover:border-amber-400/60 hover:text-amber-300 border border-slate-700/80 disabled:opacity-20 text-slate-300 text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  title="Move Up"
                  aria-label="Move Up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(idx)}
                  disabled={idx === items.length - 1}
                  className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-amber-500/20 hover:border-amber-400/60 hover:text-amber-300 border border-slate-700/80 disabled:opacity-20 text-slate-300 text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  title="Move Down"
                  aria-label="Move Down"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/60 text-xs text-rose-300 flex items-start gap-2 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setItems(INITIAL_SCRAMBLE)}
            className="text-xs text-slate-400 hover:text-amber-300 font-mono transition-colors"
          >
            ↺ Reset Order
          </button>

          <button
            type="button"
            onClick={handleVerify}
            className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-[0_0_22px_rgba(245,158,11,0.55)] border border-amber-300/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Verify Pipeline Sequence →
          </button>
        </div>
      </div>
    </div>
  );
};
