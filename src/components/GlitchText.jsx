import React, { useState, useEffect } from "react";

export const GlitchText = () => {
  const [phase, setPhase] = useState("compromised"); // "compromised" -> "restoring"

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => (prev === "compromised" ? "restoring" : "compromised"));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative inline-block font-mono text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </span>
        <span className="text-xs tracking-widest uppercase font-semibold text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded bg-rose-950/40">
          SECURITY ALERT • PROTOCOL 108-BREACH
        </span>
      </div>

      <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wider transition-all duration-300">
        {phase === "compromised" ? (
          <span className="text-rose-500 animate-[glitch_2s_infinite] drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]">
            [ SYSTEM COMPROMISED ]
          </span>
        ) : (
          <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]">
            ✦ RESTORE IT IN 9 DAYS ✦
          </span>
        )}
      </div>

      <p className="mt-2 text-xs sm:text-sm text-slate-400 font-sans max-w-lg mx-auto">
        {phase === "compromised"
          ? "Festival operations encrypted by adversary botnet. Nine divine cryptographic powers are offline."
          : "Summon the nine archetypal powers of Maa Durga to purge malicious intrusions and reboot the celebration."}
      </p>
    </div>
  );
};
