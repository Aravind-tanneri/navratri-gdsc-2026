import React from "react";
import { Link } from "react-router-dom";
import { CONFIG } from "../config";
import { DAYS_DATA } from "../data/days";

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pb-8 border-b border-amber-500/20">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
          <div className="w-5 h-5 rounded-md bg-white p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
            <img src="/gdsc-logo.png" alt="GDSC NIT AP" className="w-full h-full object-contain" />
          </div>
          <span>Organized by <strong className="text-amber-300">GDSC NIT AP</strong></span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-100">
          About Navratri Navshakti
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          An interactive, narrative-driven DevSecOps and AI literacy quest uniting traditional Indian cultural celebration with cutting-edge engineering principles.
        </p>
      </div>

      {/* Story & Concept */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <span>📖</span> The Narrative Universe
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          During the auspicious festival of Navratri, our university's grand digital Utsav operations system—responsible for volunteer coordination, lighting choreography, sound engineering, and ticket security—was targeted by an adversarial botnet dubbed <code className="text-rose-400 font-mono">mahishasur_bot</code>.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Rather than viewing cybersecurity and engineering as sterile code in isolation, participants draw inspiration from the <strong>Nine Divine Manifestations of Maa Durga</strong>. Each day introduces a new archetype representing key real-world competencies: from initial planning and vigilance to cryptographic defense, ethical generative AI, and forensic correlation.
        </p>
      </section>

      {/* Game Rules & Scoring System */}
      <section className="space-y-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <span>⚖️</span> Quest Rules & Scoring Mechanics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl border-amber-500/30 space-y-2">
            <div className="text-2xl">🎯</div>
            <h3 className="font-bold text-sm text-slate-100">Base Score</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each daily challenge starts with <strong>100 points</strong>. Speed is tracked as a tiebreaker for leaderboard glory.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-amber-500/30 space-y-2">
            <div className="text-2xl">💡</div>
            <h3 className="font-bold text-sm text-slate-100">Hint & Error Penalties</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Using a divine hint docks <strong>5 points</strong>. Each incorrect submission docks <strong>5 points</strong> (minimum floor of 40 points per day).
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-amber-500/30 space-y-2">
            <div className="text-2xl">🔓</div>
            <h3 className="font-bold text-sm text-slate-100">Sequential Progression</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Days unlock one by one. The Day 9 Final Unlock requires clues discovered across Days 1 through 8. (Organizers can toggle <code className="text-amber-300 font-mono">UNLOCK_ALL</code> in <code className="text-amber-300 font-mono">src/config.js</code>).
            </p>
          </div>
        </div>
      </section>

      {/* How the 9 Events Connect: The Forensic Chain */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>🔗</span> How the 9 Challenges Connect
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Every challenge solves a phase of the incident response lifecycle, extracting one piece of the forensic jigsaw puzzle:
          </p>
        </div>

        <div className="space-y-3">
          {DAYS_DATA.map((d) => (
            <div
              key={d.day}
              className="p-4 rounded-2xl bg-black/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0">
                  {d.day}
                </span>
                <div>
                  <div className="font-bold text-slate-200">
                    {d.devi} • {d.title}
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">
                    Skill: {d.skillTag}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[10px] uppercase font-mono text-slate-500">
                  Unveils:
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-amber-500/30 text-amber-300 font-mono font-bold text-[11px]">
                  {d.clueLabel} = "{d.clueValue}"
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GDSC Team Contact */}
      <section className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-700 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-white p-2 border border-amber-400/50 shadow-[0_0_28px_rgba(245,158,11,0.3)] overflow-hidden flex items-center justify-center">
          <img src="/gdsc-logo.png" alt="GDSC NIT AP" className="w-full h-full object-contain" />
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
          About Google Developer Student Club (GDSC NIT AP)
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          GDSC NIT AP is the official university-based developer community at the National Institute of Technology Andhra Pradesh. By organizing interactive hackathons, cybersecurity simulations, and developer literacy quests, we empower students to build real-world tech solutions.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="px-8 py-3.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:from-amber-300 hover:to-rose-500 text-slate-950 shadow-[0_0_24px_rgba(245,158,11,0.55)] border border-amber-300/60 hover:scale-105 active:scale-95 transition-all inline-block"
          >
            Start the Quest Now →
          </Link>
        </div>
      </section>

    </div>
  );
};
