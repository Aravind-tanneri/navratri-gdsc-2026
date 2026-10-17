import React from "react";
import { Link } from "react-router-dom";
import { GlitchText } from "./GlitchText";
import { useGame } from "../context/GameContext";
import { CONFIG } from "../config";

export const Hero = () => {
  const { completedDays, isAllRestored } = useGame();

  // Next available day
  const nextDay = Math.min(9, completedDays.length + 1);

  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      
      {/* Background Sacred Geometric Mandala SVG */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] pointer-events-none opacity-20 select-none">
        <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_120s_linear_infinite]">
          <circle cx="200" cy="200" r="190" stroke="#f59e0b" strokeWidth="1" fill="none" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="150" stroke="#db2777" strokeWidth="1" fill="none" />
          <circle cx="200" cy="200" r="110" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeDasharray="8 6" />
          <circle cx="200" cy="200" r="70" stroke="#0d9488" strokeWidth="1" fill="none" />
          {/* 8-fold lotus rays */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="200"
              y1="200"
              x2={200 + 180 * Math.cos((i * Math.PI) / 6)}
              y2={200 + 180 * Math.sin((i * Math.PI) / 6)}
              stroke="#fbbf24"
              strokeWidth="0.8"
              opacity="0.4"
            />
          ))}
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto z-10 flex flex-col items-center">
        
        {/* GDSC Hero Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/95 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] mb-6">
          <div className="w-5 h-5 rounded-md bg-white p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
            <img src="/gdsc-logo.png" alt="GDSC NIT AP" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            Presented by <strong className="text-amber-300">GDSC NIT AP</strong>
          </span>
          <span className="text-[10px] font-mono text-amber-400/80 uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
            Official Chapter
          </span>
        </div>

        {/* Glitch Tech Alert */}
        <GlitchText />

        {/* Main Epic Heading */}
        <h1 className="mt-6 font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-400 tracking-tight leading-tight">
          Navratri Navshakti
        </h1>
        <p className="font-serif text-lg sm:text-2xl text-amber-300/90 italic tracking-wider mt-1">
          Restore the Utsav
        </p>

        {/* Story Intro Text */}
        <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          The digital firewall protecting the grand Navratri Utsav has been compromised by an adversarial botnet.
          Harness the nine divine virtues of Maa Durga—from foundational SDLC architecture to ethical AI and forensics.
          Solve the daily challenges, gather the 8 forensic clues, and reboot the festive matrix!
        </p>

        {/* CTA Buttons & Floating Diya */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={isAllRestored ? "/final" : `/day/${nextDay}`}
            className="px-8 py-4 rounded-2xl text-sm sm:text-base font-black bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:from-amber-300 hover:via-orange-400 hover:to-rose-500 text-slate-950 shadow-[0_0_28px_rgba(245,158,11,0.55),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_0_40px_rgba(249,115,22,0.8)] hover:scale-105 active:scale-95 transition-all border border-amber-200/70 cursor-pointer flex items-center gap-2.5"
          >
            <span className="text-xl">🪔</span>
            <span>
              {isAllRestored
                ? "View Restored System Matrix →"
                : completedDays.length === 0
                ? "Start the Quest (Day 1) →"
                : `Continue Quest (Day ${nextDay}) →`}
            </span>
          </Link>

          <Link
            to="/scorecard"
            className="px-7 py-4 rounded-2xl text-sm font-bold bg-slate-950/80 hover:bg-white/10 text-slate-100 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_22px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
          >
            <span>📜</span>
            <span>Inspect Clue Book</span>
          </Link>
        </div>

        {/* Mini Feature Highlights */}
        <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-xl text-center">
          <div className="glass-card p-3 rounded-xl border-amber-500/20">
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">9 Days</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Navshakti Powers</div>
          </div>
          <div className="glass-card p-3 rounded-xl border-amber-500/20">
            <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400">100% Free</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">No Login / Open</div>
          </div>
          <div className="glass-card p-3 rounded-xl border-amber-500/20">
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">GDSC</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Verified Badges</div>
          </div>
        </div>

      </div>
    </section>
  );
};
