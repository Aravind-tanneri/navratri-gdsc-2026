import React, { useState } from "react";
import { useGame } from "../context/GameContext";

const SQL_FIX_OPTIONS = [
  {
    id: "raw",
    label: "Option 1 (Concatenation)",
    code: `const sql = "SELECT * FROM users WHERE username = '" + username + "' AND pin = '" + pin + "';";\nawait db.query(sql);`,
    isCorrect: false,
    reason: "Still vulnerable to SQL Injection! Attacker can enter username: ' OR '1'='1 --",
  },
  {
    id: "param",
    label: "Option 2 (Parameterized Query - Prepared Statement)",
    code: `const sql = "SELECT * FROM users WHERE username = $1 AND pin = $2;";\nawait db.query(sql, [username, pin]);`,
    isCorrect: true,
    reason: "Secure! The database driver treats parameters purely as literals, rendering injection attacks harmless.",
  },
  {
    id: "upper",
    label: "Option 3 (Uppercase Filter)",
    code: `const sql = "SELECT * FROM users WHERE username = '" + username.toUpperCase() + "';";\nawait db.query(sql);`,
    isCorrect: false,
    reason: "Uppercasing strings does not prevent SQL syntax alteration like ' UNION SELECT * FROM secrets --",
  },
];

const LOOP_FIX_OPTIONS = [
  {
    id: "lte",
    label: "Option A: i <= attendees.length",
    code: `for (let i = 0; i <= attendees.length; i++) {\n  validatePass(attendees[i]);\n}`,
    isCorrect: false,
    reason: "Off-by-one error: When i === attendees.length, attendees[i] is undefined, throwing runtime exception!",
  },
  {
    id: "lt",
    label: "Option B: i < attendees.length",
    code: `for (let i = 0; i < attendees.length; i++) {\n  validatePass(attendees[i]);\n}`,
    isCorrect: true,
    reason: "Correct! Arrays are 0-indexed, so valid indices run strictly from 0 to length - 1.",
  },
  {
    id: "plus",
    label: "Option C: i <= attendees.length + 1",
    code: `for (let i = 0; i <= attendees.length + 1; i++) {\n  validatePass(attendees[i]);\n}`,
    isCorrect: false,
    reason: "Worse off-by-one error: Iterates 2 elements beyond the array boundary.",
  },
];

export const Day6 = ({ dayData, onSuccess }) => {
  const { recordWrongAttempt } = useGame();
  const [selectedSqlId, setSelectedSqlId] = useState("raw");
  const [selectedLoopId, setSelectedLoopId] = useState("lte");
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleTestPatches = () => {
    const isSqlGood = SQL_FIX_OPTIONS.find((o) => o.id === selectedSqlId)?.isCorrect;
    const isLoopGood = LOOP_FIX_OPTIONS.find((o) => o.id === selectedLoopId)?.isCorrect;

    if (isSqlGood && isLoopGood) {
      setErrorMessage("");
      onSuccess();
    } else {
      recordWrongAttempt(6);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      if (!isSqlGood && !isLoopGood) {
        setErrorMessage("Both the authentication query and loop bounds still contain critical bugs!");
      } else if (!isSqlGood) {
        setErrorMessage("Database query is still prone to SQL Injection. Use parameterized placeholders ($1, $2)!");
      } else {
        setErrorMessage("The ticket scanner loop still has an off-by-one boundary defect. Check array indexing!");
      }
    }
  };

  const selectedSql = SQL_FIX_OPTIONS.find((o) => o.id === selectedSqlId);
  const selectedLoop = LOOP_FIX_OPTIONS.find((o) => o.id === selectedLoopId);

  return (
    <div className="w-full space-y-6">
      <div className="glass-card rounded-2xl border border-rose-500/40 p-5 sm:p-6 shadow-[0_0_25px_rgba(244,63,94,0.15)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚔️</span>
            <div>
              <h4 className="text-sm font-bold text-slate-100 font-serif">
                Maa Katyayani's Debugging Forge
              </h4>
              <p className="text-xs text-slate-400">
                Fix the SQL injection route and patch the ticket validator loop boundary bug.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
            CWE-89 & CWE-193
          </span>
        </div>

        {/* Live IDE Code Block */}
        <div className="my-5 rounded-2xl bg-[#08020e] border border-slate-800 overflow-hidden shadow-inner font-mono text-xs">
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-slate-400 text-[11px]">auth-controller.js</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase">JavaScript (Node.js)</span>
          </div>

          <div className="p-4 text-slate-300 space-y-4 overflow-x-auto">
            <div>
              <span className="text-slate-400">// Patch 1: Volunteer Authentication Handler</span>
              <pre className="mt-1 text-rose-300 bg-black/50 p-3 rounded-lg border border-slate-800">
                {selectedSql.code}
              </pre>
            </div>

            <div>
              <span className="text-slate-400">// Patch 2: Stage Ticket Validation Loop</span>
              <pre className="mt-1 text-amber-300 bg-black/50 p-3 rounded-lg border border-slate-800">
                {selectedLoop.code}
              </pre>
            </div>
          </div>
        </div>

        {/* Interactive Patch Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Bug 1: SQL Injection */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase text-rose-400 flex items-center gap-1.5">
              <span>🛡️</span> 1. Select Authentication Query Implementation:
            </label>
            {SQL_FIX_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setSelectedSqlId(opt.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedSqlId === opt.id
                    ? "bg-rose-500/20 border-rose-400 text-slate-100 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                    : "bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300"
                }`}
              >
                <div className="font-bold mb-1 flex justify-between items-center">
                  <span>{opt.label}</span>
                  <span className="font-mono text-[10px]">{selectedSqlId === opt.id ? "● Selected" : "○"}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono line-clamp-1">{opt.code.split("\n")[0]}</div>
              </div>
            ))}
          </div>

          {/* Bug 2: Off by one */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
              <span>🔁</span> 2. Select Loop Boundary Condition:
            </label>
            {LOOP_FIX_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setSelectedLoopId(opt.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedLoopId === opt.id
                    ? "bg-amber-500/20 border-amber-400 text-slate-100 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    : "bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300"
                }`}
              >
                <div className="font-bold mb-1 flex justify-between items-center">
                  <span>{opt.label}</span>
                  <span className="font-mono text-[10px]">{selectedLoopId === opt.id ? "● Selected" : "○"}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono line-clamp-1">{opt.code.split("\n")[0]}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Error message */}
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

        {/* Submit Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={handleTestPatches}
            className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-rose-500 via-red-600 to-pink-600 hover:from-rose-400 hover:to-red-500 text-white shadow-[0_0_24px_rgba(244,63,94,0.55)] border border-rose-300/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Compile & Execute Automated Test Suite →
          </button>
        </div>

      </div>
    </div>
  );
};
