import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGame } from "../context/GameContext";
import toast from "react-hot-toast";

export const Navbar = ({ onOpenNameModal }) => {
  const {
    playerName,
    systemIntegrity,
    totalScore,
    isSoundMuted,
    toggleSound,
    resetProgress,
    completedDays,
  } = useGame();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const location = useLocation();

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    toast.error("Quest progress and forensic clues reset! ↺");
  };

  const handleToggleSound = () => {
    toggleSound();
    if (isSoundMuted) {
      toast("Festive temple bells enabled! 🔔", { icon: "🔔" });
    } else {
      toast("Audio muted 🔇", { icon: "🔇" });
    }
  };

  const navLinks = [
    { label: "Quest", path: "/" },
    { label: "Scorecard & Clues", path: "/scorecard" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "About GDSC", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-gradient-to-r from-[#1c0418]/92 via-[#110321]/94 to-[#070c26]/92 border-b border-amber-500/35 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2),0_4px_20px_rgba(0,0,0,0.7)] transition-all">
      
      {/* Radiant golden accent rim at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/70 via-rose-500/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between relative gap-2">
        
        {/* Brand & GDSC Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 shrink">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white p-1 border border-amber-400/60 flex items-center justify-center shadow-[0_0_16px_rgba(245,158,11,0.4)] group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(245,158,11,0.7)] transition-all overflow-hidden shrink-0">
            <img src="/gdsc-logo.png" alt="GDSC NIT AP" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-serif text-lg sm:text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)] whitespace-nowrap">
                Navshakti
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-rose-500/20 text-amber-200 border border-amber-400/50 font-mono font-bold uppercase tracking-wider shadow-[0_0_8px_rgba(245,158,11,0.25)] hidden md:inline-block whitespace-nowrap">
                Utsav 2026
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium whitespace-nowrap truncate leading-none mt-0.5">
              <span className="hidden sm:inline text-slate-400">Presented by </span>
              <strong className="text-amber-200/90 font-bold">GDSC NIT AP</strong>
            </div>
          </div>
        </Link>

        {/* Center Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all border ${
                  isActive
                    ? "text-amber-200 bg-gradient-to-r from-amber-500/25 via-rose-500/15 to-amber-500/10 border-amber-400/60 shadow-[0_0_14px_rgba(245,158,11,0.3)]"
                    : "text-slate-200 hover:text-amber-200 hover:bg-white/10 hover:border-amber-400/40 border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Integrity Pill (desktop only; mobile gets it in drawer) */}
          <Link
            to="/scorecard"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-950/90 to-indigo-950/80 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:border-amber-400/60 transition-all group shrink-0"
            title="System Integrity Status"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-xs font-mono text-slate-300">
              Integrity:{" "}
              <strong className={systemIntegrity === 100 ? "text-emerald-300" : "text-amber-300"}>
                {systemIntegrity}%
              </strong>
            </span>
          </Link>

          {/* Player / Team Badge */}
          <button
            onClick={onOpenNameModal}
            className="flex items-center gap-1 sm:gap-1.5 text-xs font-mono px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-amber-400/45 text-amber-200 hover:border-amber-300 hover:shadow-[0_0_14px_rgba(245,158,11,0.3)] transition-all cursor-pointer font-semibold shrink-0"
            title="Edit Team Name"
          >
            <span className="text-xs">🛡️</span>
            <span className="max-w-[70px] sm:max-w-[120px] truncate text-[11px] sm:text-xs">
              {playerName || "Team"}
            </span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-amber-500/35 hover:border-amber-400 text-amber-300 hover:text-amber-200 hover:shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all cursor-pointer text-xs sm:text-sm shrink-0"
            title={isSoundMuted ? "Unmute Festive Bell & Dhol" : "Mute Sound"}
            aria-label="Sound Toggle"
          >
            {isSoundMuted ? "🔇" : "🔔"}
          </button>

          {/* Reset Quest Button (desktop only; mobile has it inside menu drawer) */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="hidden sm:inline-flex p-2 rounded-xl bg-gradient-to-r from-rose-950/60 to-rose-900/40 border border-rose-500/40 hover:border-rose-400 text-rose-300 hover:text-rose-100 hover:shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all cursor-pointer text-xs font-mono shrink-0"
            title="Reset Progress"
            aria-label="Reset Progress"
          >
            ↺
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-amber-500/35 text-slate-200 hover:text-amber-300 shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 bg-gradient-to-b from-[#180424] via-[#12021d] to-[#0c0217] border-b border-amber-500/35 space-y-3 shadow-2xl animate-fade-in">
          
          {/* Mobile Team & Integrity Card */}
          <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/25 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base">🛡️</span>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 uppercase block">Call-Sign</span>
                <span className="text-xs font-bold text-slate-100 truncate block max-w-[150px]">
                  {playerName || "Anonymous Defender"}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenNameModal();
                setMobileMenuOpen(false);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30"
            >
              Edit
            </button>
          </div>

          {/* System Integrity & Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Score</span>
              <span className="text-amber-300 font-bold">{totalScore}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Powers</span>
              <span className="text-purple-300 font-bold">{completedDays.length}/9</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Integrity</span>
              <span className="text-emerald-400 font-bold">{systemIntegrity}%</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-1 pt-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                      : "text-slate-200 hover:bg-white/5 hover:text-amber-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Reset Action */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                setShowResetConfirm(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-medium bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/50 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>↺</span>
              <span>Reset Quest Progress</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-sm w-full p-6 rounded-3xl border border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.35)] text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-slate-100 font-serif">Reset Quest Progress?</h3>
            <p className="text-xs text-slate-300 mt-2 mb-6 leading-relaxed">
              This will clear all collected powers, clues, and scorecard stats from your device. Are you sure you want to reboot from Day 1?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
