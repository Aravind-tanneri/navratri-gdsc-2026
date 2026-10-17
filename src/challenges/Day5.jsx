import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { sanitizeInput, rateLimiter } from "../utils/security";

const ROLES = {
  A: {
    roleName: "Network Traffic Guard (Player A)",
    icon: "📡",
    fragmentLabel: "Fragment Alpha [Part 1 of 3]",
    codeSegment: "DANDIYA_",
    telemetry: "Captured inbound SQL queries spikes on Port 5432 targeting the attendee reservation microservice.",
    note: "Share your code segment 'DANDIYA_' with Player B and Player C.",
  },
  B: {
    roleName: "Cloud Infrastructure Sentinel (Player B)",
    icon: "☁️",
    fragmentLabel: "Fragment Beta [Part 2 of 3]",
    codeSegment: "BOOKING_",
    telemetry: "Observed anomalous table read transactions dumping user ticket records to an external cloud bucket.",
    note: "Share your code segment 'BOOKING_' with Player A and Player C.",
  },
  C: {
    roleName: "Database Identity Keeper (Player C)",
    icon: "🔐",
    fragmentLabel: "Fragment Gamma [Part 3 of 3]",
    codeSegment: "DATABASE",
    telemetry: "Detected privilege escalation dropping the foreign key constraints on festival transactions.",
    note: "Share your code segment 'DATABASE' with Player A and Player B.",
  },
};

export const Day5 = ({ dayData, onSuccess }) => {
  const { recordWrongAttempt } = useGame();
  const [activeRoleKey, setActiveRoleKey] = useState("A");
  const [enteredCode, setEnteredCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const activeRole = ROLES[activeRoleKey];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Rate limit: max 4 attempts per 6 seconds
    const limit = rateLimiter.checkLimit("day5_submit", 4, 6);
    if (!limit.allowed) {
      setErrorMessage(`Rate limit: Excessive key assembly attempts. Please wait ${limit.retryAfterSeconds}s.`);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    const cleanInput = sanitizeInput(enteredCode, 50);
    const normalized = cleanInput.trim().toUpperCase().replace(/\s+/g, "_");

    if (
      normalized === "DANDIYA_BOOKING_DATABASE" ||
      normalized === "DANDIYA BOOKING DATABASE"
    ) {
      setErrorMessage("");
      onSuccess();
    } else {
      recordWrongAttempt(5);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setErrorMessage(
        "Fragment mismatch! Assemble all 3 parts in order: Part 1 (Player A) + Part 2 (Player B) + Part 3 (Player C)."
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="glass-card rounded-2xl border border-emerald-500/30 p-5 sm:p-6 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
        
        {/* Header & Instructions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌿</span>
            <div>
              <h4 className="text-sm font-bold text-slate-100 font-serif">
                Multi-Terminal Sharded Encryption Key
              </h4>
              <p className="text-xs text-slate-400">
                Each team role possesses one sharded fragment. Switch consoles or sync with teammates!
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
            Role-Based Cryptography
          </span>
        </div>

        {/* Role Selector Tabs */}
        <div className="my-5">
          <label className="text-xs font-mono uppercase text-slate-400 block mb-2">
            Select Your Active Console Station:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(ROLES).map(([key, role]) => {
              const isActive = activeRoleKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveRoleKey(key);
                    setErrorMessage("");
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-500/20 border-emerald-400 text-slate-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      : "bg-slate-900/60 hover:bg-slate-800 border-slate-700/80 text-slate-400"
                  }`}
                >
                  <div className="text-xl mb-1">{role.icon}</div>
                  <div className="font-bold text-xs">Player {key}</div>
                  <div className="text-[10px] hidden sm:block text-slate-400 truncate mt-0.5">
                    {role.roleName.split("(")[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Role Terminal Output */}
        <div className="terminal-panel p-4 sm:p-5 rounded-2xl border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span>{activeRole.icon}</span> {activeRole.roleName}
            </span>
            <span className="text-slate-400">{activeRole.fragmentLabel}</span>
          </div>

          <div className="bg-black/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Cryptographic Segment:</span>
            <span className="text-base font-bold font-mono text-emerald-300 tracking-wider">
              {activeRole.codeSegment}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            <strong className="text-emerald-400 font-mono">Telemetry Observation: </strong>
            {activeRole.telemetry}
          </p>

          <div className="text-[11px] text-amber-300/90 font-mono bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
            💬 {activeRole.note}
          </div>
        </div>

        {/* Combined Key Entry Form */}
        <form onSubmit={handleSubmit} className="mt-6 pt-4 border-t border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Unified Master Recovery Code (Part 1 + Part 2 + Part 3):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                placeholder="e.g. DANDIYA_BOOKING_DATABASE"
                className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-600 outline-none uppercase transition-all ${
                  isShaking ? "animate-[shake_0.4s_ease-in-out] border-rose-500" : "border-slate-700 focus:border-emerald-400"
                }`}
              />
              <button
                type="submit"
                className="px-7 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-[0_0_22px_rgba(16,185,129,0.55)] border border-emerald-300/60 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                Synthesize Key →
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}
        </form>

      </div>
    </div>
  );
};
