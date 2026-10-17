import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { sanitizeInput, rateLimiter } from "../utils/security";

const PRESET_PROMPTS = [
  "Analyze breach telemetry: Which communication protocol was abused?",
  "Review system integrity: Were automated firmware patches cryptographically verified?",
  "Examine cryptographic keys: Was any algorithm decrypted by brute force?",
  "Summarize root incident directive: What hidden advisory was logged in the kernel?",
];

const MOCK_AI_STATEMENTS = [
  {
    id: "s1",
    text: "Log timestamps confirm attacker packets utilized TLS 1.3 over TCP port 443.",
    isHallucination: false,
    explanation: "Accurate: HTTPS traffic was captured on port 443 with TLS 1.3.",
  },
  {
    id: "s2",
    text: "The threat actor leveraged quantum entanglement to decipher all 4096-bit RSA keys within 0.2 milliseconds.",
    isHallucination: true,
    explanation: "HALLUCINATION: Practical quantum computers capable of breaking RSA-4096 in milliseconds do not exist today.",
  },
  {
    id: "s3",
    text: "Telemetry shows the festival controllers executed a package received without cryptographic digital signature verification.",
    isHallucination: false,
    explanation: "Accurate: Unsigned packages bypassed local integrity validation.",
  },
  {
    id: "s4",
    text: "System telemetry memory was stored mechanically inside copper pendulum clocks behind the idol.",
    isHallucination: true,
    explanation: "HALLUCINATION: Computer telemetry runs on silicon NVMe/RAM, not mechanical pendulum clocks.",
  },
  {
    id: "s5",
    text: "The embedded recovery guideline logged by the kernel system architect explicitly states: 'Trust no unsigned update'.",
    isHallucination: false,
    explanation: "Accurate: This is the verified system defense directive.",
  },
];

export const Day4 = ({ dayData, onSuccess }) => {
  const { recordWrongAttempt } = useGame();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaste! I am the GDSC Kushmanda AI Copilot. I analyze festival security telemetry. However, like all LLMs, I sometimes hallucinate! Ask me questions, inspect my output, and tap every hallucinated statement to purge falsehoods.",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [tappedIds, setTappedIds] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendPrompt = (promptText) => {
    // Rate limit: max 3 prompts per 5 seconds
    const limit = rateLimiter.checkLimit("day4_prompt", 3, 5);
    if (!limit.allowed) {
      setErrorMessage(`Rate limit: AI Copilot cooling down. Please wait ${limit.retryAfterSeconds}s.`);
      return;
    }

    const raw = (promptText || inputPrompt).trim();
    const cleanPrompt = sanitizeInput(raw, 200);
    if (!cleanPrompt) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: cleanPrompt },
      {
        role: "assistant",
        isTelemetryReport: true,
        text: "Analyzing logs with generative model... Cross-referencing 4 incident telemetry logs against knowledge repository:",
      },
    ]);
    setInputPrompt("");
    setHasQueried(true);
    setErrorMessage("");
  };

  const toggleStatementTap = (id) => {
    setTappedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setErrorMessage("");
  };

  const handleVerifyHallucinations = () => {
    const hallucinationIds = MOCK_AI_STATEMENTS.filter((s) => s.isHallucination).map((s) => s.id);
    const caughtAll = hallucinationIds.every((id) => tappedIds.includes(id));
    const noFalsePositives = tappedIds.every((id) => hallucinationIds.includes(id));

    if (caughtAll && noFalsePositives) {
      setErrorMessage("");
      onSuccess();
    } else {
      recordWrongAttempt(4);
      if (!caughtAll && !noFalsePositives) {
        setErrorMessage("You tapped legitimate technical facts and missed real AI hallucinations!");
      } else if (!caughtAll) {
        setErrorMessage("You missed one or more AI hallucinations. Look for scientifically impossible claims!");
      } else {
        setErrorMessage("You tapped factual statements as hallucinations. Review the prompt tips!");
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Chat Assistant (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-2xl border border-orange-500/30 flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">✨</span>
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  Kushmanda AI Telemetry Copilot
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono">
                    Mock Mode (Gemini Ready)
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  Spot and tap the hallucinated statements in the AI's analysis.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-orange-400">
              {tappedIds.length} Hallucinations Flagged
            </span>
          </div>

          {/* Chat Stream */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[460px] overflow-y-auto">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs sm:text-sm ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-sm shrink-0">
                    🤖
                  </div>
                )}
                
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-orange-500 text-slate-950 font-medium rounded-tr-none shadow-md"
                      : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none"
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Interactive Statements when report is delivered */}
                  {m.isTelemetryReport && (
                    <div className="mt-4 space-y-2 pt-3 border-t border-slate-800">
                      <span className="text-[11px] font-mono text-amber-300 block mb-2 font-bold">
                        👉 Click on all statements that are AI Hallucinations (Falsehoods):
                      </span>

                      {MOCK_AI_STATEMENTS.map((stmt) => {
                        const isTapped = tappedIds.includes(stmt.id);
                        return (
                          <div
                            key={stmt.id}
                            onClick={() => toggleStatementTap(stmt.id)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2 ${
                              isTapped
                                ? "bg-rose-950/60 border-rose-500 text-rose-200 line-through decoration-rose-400 decoration-2 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                                : "bg-black/40 hover:bg-black/70 border-slate-700/80 text-slate-300"
                            }`}
                          >
                            <span className="font-mono text-[10px] text-slate-400 shrink-0">
                              {isTapped ? "🚩" : "○"}
                            </span>
                            <span>{stmt.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts & Input Area */}
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono text-slate-400 self-center mr-1">
                Preset Prompts:
              </span>
              {PRESET_PROMPTS.slice(0, 2).map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendPrompt(p)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-200 border border-slate-700 transition-colors truncate max-w-[280px]"
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
                placeholder="Ask the AI about incident clues..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-orange-400"
              />
              <button
                type="button"
                onClick={() => handleSendPrompt()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-[0_0_18px_rgba(255,122,0,0.45)] border border-orange-300/60 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Send Prompt
              </button>
            </div>

            {errorMessage && (
              <div className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {hasQueried && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleVerifyHallucinations}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_22px_rgba(255,122,0,0.55)] border border-amber-300/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Confirm Hallucination Filter →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Prompt Engineering Tips Side Panel (4 cols) */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
              <span className="text-lg">🧭</span>
              <h5 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Prompt Engineering Guide
              </h5>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <strong className="text-orange-400 block mb-1">1. Be Specific</strong>
                <p className="text-slate-400">
                  Vague prompts like "what happened?" yield vague answers. Specify telemetry fields, ports, and protocols.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <strong className="text-orange-400 block mb-1">2. Demand Evidence & Citations</strong>
                <p className="text-slate-400">
                  Instruct models to quote verbatim log lines rather than summarizing from broad statistical training data.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <strong className="text-orange-400 block mb-1">3. Verify AI Output</strong>
                <p className="text-slate-400">
                  AI will sound 100% confident even when fabricating impossible claims (like quantum cracking in milliseconds).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Powered by GDSC AI Track • Learn to govern LLMs with guardrails.
          </div>
        </div>

      </div>
    </div>
  );
};
