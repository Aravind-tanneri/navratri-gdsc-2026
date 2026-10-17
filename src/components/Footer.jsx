import React from "react";
import { Link } from "react-router-dom";
import { CONFIG } from "../config";

export const Footer = () => {
  return (
    <footer className="w-full mt-24 border-t border-amber-500/20 bg-[#0a0214] py-12 px-4 sm:px-6 lg:px-8 relative z-10 text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        
        {/* GDSC Presentation & Logo (Left-aligned) */}
        <div className="flex flex-col items-start text-left gap-2.5 max-w-lg">
          <div className="flex items-start gap-3.5">
            <div className="w-17 h-17 rounded-2xl bg-white p-1 border border-amber-400/50 shadow-md shrink-0 overflow-hidden flex items-center justify-center mt-0.5">
              <img src="/gdsc-logo.png" alt="GDSC NIT AP" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <span className="font-serif text-base sm:text-lg font-bold text-slate-100 block leading-tight">
                Navratri Navshakti: Restore the Utsav
              </span>
              <span className="text-xs text-slate-300 block mt-1 leading-snug">
                Presented by <strong className="text-amber-300 font-bold">GDSC NIT AP</strong> (Google Developer Student Club)
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-left leading-relaxed pl-0.5">
            Celebrating innovation, cybersecurity resilience, and culture through collaborative developer challenges.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-start md:justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <Link to="/" className="hover:text-amber-300 transition-colors">
            Quest
          </Link>
          <Link to="/scorecard" className="hover:text-amber-300 transition-colors">
            Clue Book
          </Link>
          <Link to="/leaderboard" className="hover:text-amber-300 transition-colors">
            Leaderboard
          </Link>
          <Link to="/about" className="hover:text-amber-300 transition-colors">
            About & Rules
          </Link>
        </div>

        {/* Festive Tag */}
        <div className="flex flex-col items-start md:items-end text-xs text-slate-400 gap-1.5">
          <span className="font-mono text-amber-400/90 border border-amber-500/30 px-2.5 py-1 rounded-full bg-amber-500/10">
            Jai Mata Di • Garba Mode: ON 🪘
          </span>
          <span>Designed with ❤️ by GDSC NIT AP Core Team</span>
        </div>
      </div>
    </footer>
  );
};
