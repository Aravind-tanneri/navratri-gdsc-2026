import React, { useState } from "react";
import confetti from "canvas-confetti";
import { useGame } from "../context/GameContext";
import { Link } from "react-router-dom";
import { CONFIG } from "../config";
import { rateLimiter } from "../utils/security";
import { autoSubmitScoreToGoogleForm } from "../utils/googleForm";
import toast from "react-hot-toast";

const PARAMETERS = [
  {
    key: "entryPoint",
    label: "1. Compromised Entry Point (Day 1)",
    correct: "Admin Portal",
    options: ["Admin Portal", "Public WiFi", "Vendor Bluetooth", "Smart Lighting Controller"],
  },
  {
    key: "breachMethod",
    label: "2. Breach Delivery Method (Day 2)",
    correct: "Phishing email",
    options: ["Phishing email", "DDoS Flood", "Physical USB rubber ducky", "Man-in-the-Middle ARP"],
  },
  {
    key: "nextMove",
    label: "3. Adversary's Next Move (Day 3)",
    correct: "Privilege escalation",
    options: ["Privilege escalation", "Lateral printer traversal", "Ransomware encryption", "DNS spoofing"],
  },
  {
    key: "hiddenMessage",
    label: "4. Telemetry Hidden Directive (Day 4)",
    correct: "Trust no unsigned update",
    options: ["Trust no unsigned update", "Festive peace to all", "Reboot immediately", "Default passwords forever"],
  },
  {
    key: "compromisedPart",
    label: "5. Compromised Component (Day 5)",
    correct: "Dandiya Booking Database",
    options: ["Dandiya Booking Database", "Sound System PA", "Food Court POS Terminal", "Ticket Scanner Firmware"],
  },
  {
    key: "vulnerability",
    label: "6. Root Vulnerability (Day 6)",
    correct: "SQL Injection",
    options: ["SQL Injection", "Cross-Site Scripting (XSS)", "Buffer Overflow", "Insecure Deserialization"],
  },
  {
    key: "attacker",
    label: "7. Suspected Attacker Identity (Day 7)",
    correct: "mahishasur_bot",
    options: ["mahishasur_bot", "loki_daemon", "ravana_payload", "kali_phantom"],
  },
  {
    key: "motive",
    label: "8. Primary Threat Motive (Day 8)",
    correct: "Data theft for resale",
    options: ["Data theft for resale", "Vandalism for fame", "Political protest", "Accidental glitch"],
  },
];

export const Day9 = ({ dayData, onSuccess }) => {
  const { clues, recordWrongAttempt, playerName, totalScore, totalTimeSeconds, verificationToken } = useGame();
  const [selections, setSelections] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSelect = (key, val) => {
    setSelections((prev) => ({ ...prev, [key]: val }));
    setErrorMessage("");
  };

  const handleRebootSubmit = (e) => {
    e.preventDefault();

    // Rate limit: max 3 reboot attempts per 6 seconds
    const limit = rateLimiter.checkLimit("day9_reboot", 3, 6);
    if (!limit.allowed) {
      setErrorMessage(`Rate limit: System matrix recalibrating. Please pause ${limit.retryAfterSeconds}s.`);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    const allCorrect = PARAMETERS.every((param) => selections[param.key] === param.correct);

    if (allCorrect) {
      setErrorMessage("");
      setIsRestored(true);

      // Trigger Confetti Explosion
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#f97316", "#db2777", "#10b981", "#a855f7"],
        });
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#f59e0b", "#fbbf24", "#38bdf8"],
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#db2777", "#f43f5e", "#a855f7"],
          });
        }, 350);
      } catch (err) {
        console.warn("Confetti error", err);
      }

      toast.success("🎉 Grand Restoration Complete! Navratri Utsav restored! 🪔", {
        duration: 5000,
      });

      // Background Automated Google Form Submission
      autoSubmitScoreToGoogleForm({
        name: playerName || "Anonymous Defender",
        score: totalScore,
        timeSeconds: totalTimeSeconds,
        token: verificationToken,
      }).then((res) => {
        if (res.success) {
          toast.success("🚀 Score automatically synced to live GDSC Google Sheet!", { duration: 4000 });
        }
      });

      onSuccess();
    } else {
      recordWrongAttempt(9);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      const mismatchedCount = PARAMETERS.filter(
        (param) => selections[param.key] !== param.correct
      ).length;

      toast.error(`${mismatchedCount} parameters incorrect. Check your Clue Book!`);

      setErrorMessage(
        `${mismatchedCount} parameters are incorrect or unselected. Consult your Clue Book on the right to match all collected findings!`
      );
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem < 10 ? "0" : ""}${rem}s`;
  };

  const handleShareSummary = () => {
    const text = `🪔 I restored the Navratri Utsav in "Navratri Navshakti" by GDSC! Score: ${totalScore} pts • Time: ${formatTime(
      totalTimeSeconds
    )} • Jai Mata Di!`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    toast.success("Score summary copied to clipboard! 📋");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="w-full space-y-8">
      {/* If System is Restored: Grand Celebration Result Card */}
      {isRestored ? (
        <div className="glass-card border-2 border-emerald-400 p-6 sm:p-10 rounded-3xl text-center shadow-[0_0_50px_rgba(52,211,153,0.4)] animate-fade-in relative overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

          {/* Diya Lighting Flame */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-1 shadow-[0_0_35px_rgba(245,158,11,0.8)] animate-pulse mb-4">
            <div className="w-full h-full bg-[#0d031c] rounded-3xl flex items-center justify-center text-4xl">
              🪔
            </div>
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-300 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40">
            ✦ SYSTEM RESTORATION COMPLETE • 100% INTEGRITY ✦
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-amber-200 to-purple-300 mt-3 mb-2">
            The Utsav is Restored!
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Maa Siddhidatri’s supreme wisdom has unified all nine powers. The rogue intruder{" "}
            <code className="text-rose-400 font-mono font-bold">mahishasur_bot</code> has been expelled, the
            Dandiya database is secured, and the festival celebration is back online!
          </p>

          {/* Shareable Achievement Card */}
          <div className="my-8 max-w-lg mx-auto bg-black/60 rounded-2xl p-6 border border-amber-500/40 shadow-xl text-left font-mono space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                GDSC NAVSHAKTI VALOR CREDENTIAL
              </span>
              <span className="text-[10px] text-slate-400">ID: NAV-2026-RESTORED</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">RESTORER CALL-SIGN</span>
                <span className="text-slate-100 font-bold text-sm truncate block">
                  {playerName || "DevSecOps Warrior"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">TOTAL SCORE</span>
                <span className="text-amber-400 font-bold text-sm">{totalScore} PTS</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ELAPSED QUEST TIME</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {formatTime(totalTimeSeconds)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SYSTEM INTEGRITY</span>
                <span className="text-emerald-400 font-bold text-sm">100% VERIFIED</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-white p-0.5 overflow-hidden inline-flex items-center justify-center">
                  <img src="/gdsc-logo.png" alt="GDSC NIT AP" className="w-full h-full object-contain" />
                </span>
                <span>Presented by <strong className="text-slate-200 font-bold">GDSC NIT AP</strong></span>
              </span>
              <span className="text-amber-300 font-sans">Jai Mata Di 🪘</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3.5 justify-center">
            <button
              onClick={handleShareSummary}
              className="px-7 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-[0_0_24px_rgba(245,158,11,0.55)] border border-amber-200/70 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>{copiedLink ? "✓ Copied to Clipboard!" : "📋 Copy Score Summary"}</span>
            </button>

            <Link
              to="/leaderboard"
              className="px-7 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-900/90 hover:bg-white/10 text-slate-100 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400 shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              View Local Leaderboard →
            </Link>

            <Link
              to="/scorecard"
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-300 hover:bg-white/5 border border-transparent hover:border-slate-800 transition-all"
            >
              Inspect Complete Scorecard
            </Link>
          </div>
        </div>
      ) : (
        /* The Final Unlock Matrix Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Left 8 Columns */}
          <div className="lg:col-span-8 glass-card rounded-2xl border border-purple-500/40 p-5 sm:p-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🪔</span>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-100 font-serif">
                    Maa Siddhidatri's Grand Restoration Matrix
                  </h4>
                  <p className="text-xs text-slate-400">
                    Align the 8 forensic coordinates extracted during your journey to trigger the master system reboot.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                8 Parameters Required
              </span>
            </div>

            <form onSubmit={handleRebootSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PARAMETERS.map((param) => (
                  <div key={param.key} className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-slate-300 block">
                      {param.label}
                    </label>
                    <select
                      required
                      value={selections[param.key] || ""}
                      onChange={(e) => handleSelect(param.key, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-700 text-xs text-slate-100 font-sans outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
                    >
                      <option value="" disabled>
                        -- Select Discovered Clue --
                      </option>
                      {param.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {errorMessage && (
                <div
                  className={`mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/60 text-xs text-rose-300 flex items-start gap-2 ${
                    isShaking ? "animate-[shake_0.4s_ease-in-out]" : ""
                  }`}
                >
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-purple-500 via-rose-500 to-amber-400 hover:from-purple-400 hover:via-rose-400 hover:to-amber-300 text-slate-950 shadow-[0_0_30px_rgba(168,85,247,0.6)] border border-amber-300/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Authorize Full System Reboot →
                </button>
              </div>
            </form>
          </div>

          {/* Clue Book Right 4 Columns */}
          <div className="lg:col-span-4 glass-card rounded-2xl border border-slate-700/80 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                <span className="text-xl">📜</span>
                <h5 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Your Collected Clue Book
                </h5>
              </div>

              <div className="space-y-2.5 text-xs">
                {PARAMETERS.map((param, idx) => {
                  const dayNum = idx + 1;
                  const foundClue = clues[dayNum];
                  return (
                    <div
                      key={param.key}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                    >
                      <span className="text-slate-400 font-mono text-[11px]">
                        Day {dayNum}:
                      </span>
                      {foundClue ? (
                        <span className="clue-badge text-[11px] truncate max-w-[190px]">
                          {foundClue}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-mono text-[10px] italic">
                          [Locked / Unsolved]
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Only the coordinates gathered in Days 1–8 unlock the final defense matrix.
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
