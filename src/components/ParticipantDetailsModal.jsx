import React, { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { sanitizeInput } from "../utils/security";
import toast from "react-hot-toast";

/**
 * Modal to collect/verify participant Email and Roll Number specifically
 * before auto-submitting scores to the linked Google Form.
 */
export const ParticipantDetailsModal = ({ isOpen, onClose, onConfirm, isSubmitting = false }) => {
  const { playerName, playerEmail, playerRoll, setParticipantDetails } = useGame();
  const [nameVal, setNameVal] = useState(playerName || "");
  const [emailVal, setEmailVal] = useState(playerEmail || "");
  const [rollVal, setRollVal] = useState(playerRoll || "");

  useEffect(() => {
    if (isOpen) {
      setNameVal(playerName || "");
      setEmailVal(playerEmail || "");
      setRollVal(playerRoll || "");
    }
  }, [isOpen, playerName, playerEmail, playerRoll]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = sanitizeInput(nameVal, 30).trim();
    const cleanEmail = sanitizeInput(emailVal, 80).trim();
    const cleanRoll = sanitizeInput(rollVal, 30).trim();

    if (!cleanName) {
      toast.error("Please enter your team or coder name.");
      return;
    }

    if (!cleanEmail) {
      toast.error("Please enter your email address to submit.");
      return;
    }

    // Save profile to context and localStorage
    setParticipantDetails({
      name: cleanName,
      email: cleanEmail,
      rollNumber: cleanRoll,
    });

    onConfirm({
      name: cleanName,
      email: cleanEmail,
      rollNumber: cleanRoll,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-lg cursor-pointer disabled:opacity-50"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white p-1 border border-amber-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.35)] overflow-hidden">
            <img src="/gdsc-logo.png" alt="GDSC NIT AP" className="w-full h-full object-contain" />
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
            Submit Score to Leaderboard
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Confirm your official details before auto-submitting your score and cryptographic token to Google Forms.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-amber-300 mb-1.5">
              Player / Team Call-Sign <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={30}
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value.slice(0, 30))}
              placeholder="e.g. CyberGarba Warriors"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-100 text-sm font-sans placeholder-slate-600 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-amber-300 mb-1.5">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              maxLength={80}
              value={emailVal}
              onChange={(e) => setEmailVal(e.target.value.slice(0, 80))}
              placeholder="e.g. yourname@student.nitandhra.ac.in"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-100 text-sm font-sans placeholder-slate-600 outline-none transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-amber-300 mb-1.5">
              Roll Number / Student ID <span className="text-slate-400 text-[10px] lowercase">(optional)</span>
            </label>
            <input
              type="text"
              maxLength={30}
              value={rollVal}
              onChange={(e) => setRollVal(e.target.value.slice(0, 30))}
              placeholder="e.g. 422101 or CSE-2026-09"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-100 text-sm font-sans placeholder-slate-600 outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span>🚀</span>
              <span>{isSubmitting ? "Submitting..." : "Confirm & Submit Score"}</span>
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-400">
          Sends directly to GDSC Live Leaderboard • Verified with Cryptographic Token
        </div>
      </div>
    </div>
  );
};
