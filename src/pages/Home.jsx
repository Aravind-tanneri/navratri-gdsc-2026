import React from "react";
import { Hero } from "../components/Hero";
import { IntegrityBar } from "../components/IntegrityBar";
import { DeviCard } from "../components/DeviCard";
import { DAYS_DATA } from "../data/days";
import { CONFIG } from "../config";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <Hero />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* System Integrity Bar */}
        <section id="integrity">
          <IntegrityBar />
        </section>

        {/* 9 Devi Powers Grid (3x3 on desktop) */}
        <section id="quest-grid" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                <span>🪔</span> The Nine Archetypal Virtues
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-100">
                Nine Devi Defense Nodes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Complete each daily challenge sequentially to cleanse malware partitions, discover forensic clues, and restore the digital celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {DAYS_DATA.map((dayData) => (
              <DeviCard key={dayData.day} dayData={dayData} />
            ))}
          </div>
        </section>

        {/* GDSC Mission & Community Section */}
        <section className="glass-card rounded-3xl border border-amber-500/30 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
                <span>Created by</span>
                <strong>{CONFIG.ORGANIZER}</strong>
                <span className="inline-flex gap-1 ml-1">
                  <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                  <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                  <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
                  <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
                Technology Meets Tradition: The GDSC Vision
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Navratri celebrates the triumph of collective valor and light over darkness. At the Google Developer Student Club (GDSC), we believe that today’s defenders face modern digital challenges: adversarial phishing, insecure coding, generative AI hallucinations, and telemetry blind spots. 
                "Navratri Navshakti" merges cultural celebration with hands-on computer science, security, and ethical AI literacy.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-slate-300">
                  ✦ 100% Client-Side & Private
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-slate-300">
                  ✦ Interactive Hands-on Labs
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-slate-300">
                  ✦ Shareable Achievement Badges
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-black/50 border border-amber-500/20 space-y-4">
              <div className="text-4xl animate-bounce">🪘</div>
              <h4 className="font-serif font-bold text-slate-100 text-base">
                Ready to Join the Defense?
              </h4>
              <p className="text-xs text-slate-400">
                Track your clues in the Clue Book, compete for top spot on the local leaderboard, and celebrate Navratri with code!
              </p>
              <Link
                to="/about"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-100 border border-slate-700 transition-all text-center"
              >
                Learn More About Event Rules →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
