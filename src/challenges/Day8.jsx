import React, { useState } from "react";
import { useGame } from "../context/GameContext";

const CLAIMS = [
  {
    id: 1,
    claim: "The festival committee canceled all Garba celebrations for the rest of the week due to torrential monsoon downpours.",
    evidenceSource: "Official Meteorological Campus Radar: 0.0mm precipitation recorded, skies completely clear, official schedule re-confirmed for 8:00 PM.",
    correctState: "False",
  },
  {
    id: 2,
    claim: "All ticket registration proceeds from the GDSC Utsav technical hackathon are formally pledged to support rural girls in STEM education.",
    evidenceSource: "GDSC Financial Audit Charter (Section 4.2) and Dean of Student Welfare signed grant document confirming 100% scholarship allocation.",
    correctState: "Verified",
  },
  {
    id: 3,
    claim: "A Bollywood celebrity musician is scheduled to arrive in a surprise helicopter landing at midnight on Day 9.",
    evidenceSource: "Anonymous user on Reddit r/campusrumors citing 'my cousin who knows the driver'. Zero airport clearance logs or press releases exist.",
    correctState: "Unverified",
  },
  {
    id: 4,
    claim: "The primary objective of the breach botnet was illicit financial gain through the sale of attendees' private reservation data on dark-web forums.",
    evidenceSource: "Digital Forensics Incident Dispatch 09-UTSAV: Threat actor posted encrypted preview samples on an underground forum demanding crypto payment.",
    correctState: "Verified",
  },
  {
    id: 5,
    claim: "The entire network failure was caused by a natural coronal mass ejection from the Sun that disabled local server silicon.",
    evidenceSource: "ISRO Space Weather Observatory: Solar geomagnetic indices remained at baseline quiet levels (Kp index = 1) with zero space weather disturbances.",
    correctState: "False",
  },
];

export const Day8 = ({ dayData, onSuccess }) => {
  const { recordWrongAttempt } = useGame();
  const [userAssessments, setUserAssessments] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSelectState = (claimId, stateVal) => {
    setUserAssessments((prev) => ({ ...prev, [claimId]: stateVal }));
    setErrorMessage("");
  };

  const handleVerifyClaims = () => {
    let score = 0;
    CLAIMS.forEach((c) => {
      if (userAssessments[c.id] === c.correctState) {
        score++;
      }
    });

    if (score >= 4) {
      setErrorMessage("");
      onSuccess();
    } else {
      recordWrongAttempt(8);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setErrorMessage(
        `You scored ${score} / 5. You need at least 4 out of 5 accurate evaluations. Cross-check the primary evidence dispatches carefully!`
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="glass-card rounded-2xl border border-pink-500/30 p-5 sm:p-6 shadow-[0_0_25px_rgba(236,72,153,0.15)]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌸</span>
            <div>
              <h4 className="text-sm font-bold text-slate-100 font-serif">
                Information Integrity & Responsible AI Tribunal
              </h4>
              <p className="text-xs text-slate-400">
                Cross-reference 5 claims with verified source evidence. Classify as Verified, Unverified, or False.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/30 self-start sm:self-auto">
            Passing Threshold: 4 / 5
          </span>
        </div>

        {/* Claims Cards List */}
        <div className="my-5 space-y-4">
          {CLAIMS.map((item, idx) => {
            const currentSelection = userAssessments[item.id];

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/30 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                        "{item.claim}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Evidence Card */}
                <div className="p-3 rounded-lg bg-black/50 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-amber-400 font-mono shrink-0">🔍 Evidence:</span>
                  <span className="text-slate-400">{item.evidenceSource}</span>
                </div>

                {/* Classification Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] font-mono text-slate-400">
                    Your Assessment:
                  </span>

                  <div className="flex gap-2">
                    {["Verified", "Unverified", "False"].map((opt) => {
                      const isChosen = currentSelection === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectState(item.id, opt)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 ${
                            isChosen
                              ? opt === "Verified"
                                ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_14px_rgba(16,185,129,0.55)] border border-emerald-300/60"
                                : opt === "False"
                                ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_14px_rgba(244,63,94,0.55)] border border-rose-300/60"
                                : "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-[0_0_14px_rgba(245,158,11,0.55)] border border-amber-300/60"
                              : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-pink-400/50"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div
            className={`p-3 rounded-xl bg-rose-950/60 border border-rose-500/60 text-xs text-rose-300 flex items-start gap-2 ${
              isShaking ? "animate-[shake_0.4s_ease-in-out]" : ""
            }`}
          >
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={handleVerifyClaims}
            disabled={Object.keys(userAssessments).length < 5}
            className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 hover:from-pink-300 hover:to-rose-300 text-slate-950 disabled:opacity-40 shadow-[0_0_24px_rgba(236,72,153,0.55)] border border-pink-300/60 hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans"
          >
            Audit Fact-Checking Dossier →
          </button>
        </div>

      </div>
    </div>
  );
};
