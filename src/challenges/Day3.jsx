import React, { useState } from "react";
import { useGame } from "../context/GameContext";

const SCENARIOS = [
  {
    round: 1,
    title: "Urgent Countdown Alert",
    type: "Critical Pop-up Warning",
    popupMessage:
      "⚠️ SECURITY NOTICE: Your Utsav Admin privileges expire in 03:00 minutes! Click 'QUICK OVERRIDE' to keep root session active.",
    options: [
      {
        id: "a",
        text: "Click 'QUICK OVERRIDE' immediately so the pandal sound and lights don't shut down during the aarti.",
        isCorrect: false,
        explanation: "Never click unsolicited urgent popups. Attackers use countdown timers to induce panic and steal credentials.",
      },
      {
        id: "b",
        text: "Dismiss the popup. Open your browser independently, navigate to the bookmarked official GDSC Admin Portal, and verify security logs.",
        isCorrect: true,
        explanation: "Correct! Always verify through authentic out-of-band channels rather than clicking popup links.",
      },
      {
        id: "c",
        text: "Screenshot the popup and post it on the open festival Discord channel asking if others see it.",
        isCorrect: false,
        explanation: "Posting sensitive security alerts on public channels can alert attackers that defense teams are investigating.",
      },
    ],
  },
  {
    round: 2,
    title: "Unexpected MFA Request",
    type: "Emergency Phone / SMS Dispatch",
    popupMessage:
      "SMS Dispatch: 'GDSC Security Bot detected unauthorized access from Unknown IP. Reply with your 6-digit MFA OTP code immediately to deny intruder.'",
    options: [
      {
        id: "a",
        text: "Reply to the SMS with your 6-digit OTP code to block the intruder.",
        isCorrect: false,
        explanation: "Never disclose OTPs via SMS or phone. The attacker is attempting to log into your account and needs you to supply their OTP!",
      },
      {
        id: "b",
        text: "Ignore the SMS, head directly to account security settings on the official server, revoke all active sessions, and rotate passwords.",
        isCorrect: true,
        explanation: "Correct! Legitimate authentication systems will never ask you to text your one-time passwords.",
      },
      {
        id: "c",
        text: "Forward the SMS to the venue decorator.",
        isCorrect: false,
        explanation: "Venue decorators cannot assist with server account credential attacks.",
      },
    ],
  },
  {
    round: 3,
    title: "Suspicious USB at Soundstage",
    type: "Physical Security Anomaly",
    popupMessage:
      "A volunteer finds an unlabeled black USB flash drive sitting on the master sound mixing console with a sticker: 'Garba_2026_Top_Remixes_VIP.mp3.exe'.",
    options: [
      {
        id: "a",
        text: "Plug it into the primary stage laptop to preview the remixes before the crowd arrives.",
        isCorrect: false,
        explanation: "Dangerous! Malicious flash drives can contain BadUSB firmware or execute trojan horse scripts (.mp3.exe).",
      },
      {
        id: "b",
        text: "Format the USB flash drive and use it to store photos of today's Garba dance competition.",
        isCorrect: false,
        explanation: "Hardware-level BadUSB microcontrollers execute keystrokes regardless of drive formatting.",
      },
      {
        id: "c",
        text: "Isolate the USB in an anti-static bag, do not connect it to any festival system, and deliver it to the GDSC SOC team for sandboxed inspection.",
        isCorrect: true,
        explanation: "Correct! Physical device isolation protects critical stage and network hardware from zero-day hardware injection.",
      },
    ],
  },
];

export const Day3 = ({ dayData, onSuccess }) => {
  const { recordWrongAttempt } = useGame();
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  const scenario = SCENARIOS[currentRoundIdx];

  const handleOptionSelect = (opt) => {
    setSelectedOption(opt);
    setFeedback(null);
  };

  const handleSubmitRound = () => {
    if (!selectedOption) return;

    if (selectedOption.isCorrect) {
      setFeedback({ type: "success", text: selectedOption.explanation });
      setTimeout(() => {
        if (currentRoundIdx + 1 < SCENARIOS.length) {
          setCurrentRoundIdx((prev) => prev + 1);
          setSelectedOption(null);
          setFeedback(null);
        } else {
          onSuccess();
        }
      }, 1400);
    } else {
      recordWrongAttempt(3);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setFeedback({ type: "error", text: selectedOption.explanation });
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="glass-card rounded-2xl border border-amber-500/40 p-5 sm:p-6 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
        
        {/* Round Progress Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <div>
              <h4 className="text-sm font-bold text-slate-100 font-serif">
                Incident Response Decision Gateway
              </h4>
              <p className="text-xs text-amber-300 font-mono">
                Scenario {currentRoundIdx + 1} of {SCENARIOS.length}: {scenario.title}
              </p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {SCENARIOS.map((_, idx) => (
              <div
                key={idx}
                className={`w-6 h-2 rounded-full transition-colors ${
                  idx < currentRoundIdx
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    : idx === currentRoundIdx
                    ? "bg-amber-400"
                    : "bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Simulated Alarming Alert Box */}
        <div
          className={`my-5 p-4 rounded-xl border bg-rose-950/40 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.25)] flex items-start gap-3 ${
            isShaking ? "animate-[shake_0.4s_ease-in-out]" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-lg shrink-0">
            ⚠️
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold mb-1">
              [Simulated Alert: {scenario.type}]
            </div>
            <p className="text-xs sm:text-sm text-slate-100 font-mono leading-relaxed">
              {scenario.popupMessage}
            </p>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Select the most secure, protocol-compliant reaction:
          </label>

          {scenario.options.map((opt) => {
            const isSelected = selectedOption?.id === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleOptionSelect(opt)}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-400 text-slate-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "bg-slate-900/60 hover:bg-slate-800/60 border-slate-700/80 text-slate-300"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-amber-400 text-slate-950" : "bg-black/60 text-slate-400 border border-slate-700"
                  }`}
                >
                  {opt.id.toUpperCase()}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </div>
            );
          })}
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed animate-fade-in flex items-start gap-2 ${
              feedback.type === "success"
                ? "bg-emerald-950/50 border-emerald-500/60 text-emerald-300"
                : "bg-rose-950/60 border-rose-500/60 text-rose-300"
            }`}
          >
            <span className="text-base">{feedback.type === "success" ? "✓" : "✕"}</span>
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            disabled={!selectedOption}
            onClick={handleSubmitRound}
            className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 disabled:opacity-40 shadow-[0_0_22px_rgba(245,158,11,0.55)] border border-amber-300/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Confirm Response Protocol →
          </button>
        </div>

      </div>
    </div>
  );
};
