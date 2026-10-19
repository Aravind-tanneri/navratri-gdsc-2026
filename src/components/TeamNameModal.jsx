import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { sanitizeInput } from "../utils/security";
import toast from "react-hot-toast";

export const TeamNameModal = ({ isOpen, onClose }) => {
  const { playerName, playerEmail, playerRoll, setParticipantDetails } = useGame();
  const [nameVal, setNameVal] = useState(playerName || "");
  const [emailVal, setEmailVal] = useState(playerEmail || "");
  const [rollVal, setRollVal] = useState(playerRoll || "");

  // Sync inputs if modal opens or props change
  React.useEffect(() => {
    if (isOpen) {
      setNameVal(playerName || "");
      setEmailVal(playerEmail || "");
      setRollVal(playerRoll || "");
    }
  }, [isOpen, playerName, playerEmail, playerRoll]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = sanitizeInput(nameVal, 30);
    const cleanEmail = sanitizeInput(emailVal, 80).trim();
    const cleanRoll = sanitizeInput(rollVal, 30).trim();

    if (!cleanName) {
      toast.error("Please provide a team or player call-sign.");
      return;
    }
    if (!cleanEmail) {
      toast.error("Please provide an email address.");
      return;
    }

    setParticipantDetails({
      name: cleanName,
      email: cleanEmail,
      rollNumber: cleanRoll,
    });
    toast.success(`Participant profile saved, ${cleanName}! 🛡️`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative">
        
        {/* Close Button if name already exists */}
        {playerName && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
          >
            ✕
          </button>
        )}

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white p-1.5 border border-amber-400/60 flex items-center justify-center shadow-[0_0_24px_rgba(245,158,11,0.35)] overflow-hidden">
            <img src="/gdsc-logo.png" alt="GDSC NIT AP" className="w-full h-full object-contain" />
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
            Identify Your Squad
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Provide your details for leaderboard recognition and official Google Form automated scoring.
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
              placeholder="e.g. CyberGarba Warriors or Ananya"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-100 text-sm font-sans placeholder-slate-600 outline-none transition-colors"
              autoFocus
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
              placeholder="e.g. student@nitandhra.ac.in"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-100 text-sm font-sans placeholder-slate-600 outline-none transition-colors"
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
            {playerName && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              Save & Enter Quest →
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-400">
          Powered by GDSC • Stored safely on your local device
        </div>
      </div>
    </div>
  );
};
