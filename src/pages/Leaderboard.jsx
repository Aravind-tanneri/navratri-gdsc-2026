import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { CONFIG } from "../config";
import { parseLeaderboardCSV, exportLeaderboardToCSV } from "../utils/csv";
import { autoSubmitScoreToGoogleForm } from "../utils/googleForm";
import { ParticipantDetailsModal } from "../components/ParticipantDetailsModal";
import toast from "react-hot-toast";

export const Leaderboard = () => {
  const {
    leaderboard,
    playerName,
    playerEmail,
    playerRoll,
    totalScore,
    totalTimeSeconds,
    completedDays,
    verificationToken,
  } = useGame();

  const [activeTab, setActiveTab] = useState("global"); // 'global' | 'local'
  const [globalEntries, setGlobalEntries] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(null);
  const [syncError, setSyncError] = useState(null);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem < 10 ? "0" : ""}${rem}s`;
  };

  const [syncStatusInfo, setSyncStatusInfo] = useState(null);

  const executeAutoSubmit = async (details = {}) => {
    setIsAutoSubmitting(true);
    const toastId = toast.loading("Auto-submitting your score to GDSC Sheet...", { id: "auto-submit" });
    const res = await autoSubmitScoreToGoogleForm({
      name: details.name || playerName || "Anonymous Defender",
      email: details.email || playerEmail || "",
      rollNumber: details.rollNumber || playerRoll || "",
      score: totalScore,
      timeSeconds: totalTimeSeconds,
      token: verificationToken,
    });
    setIsAutoSubmitting(false);
    setShowDetailsModal(false);
    if (res.success) {
      if (res.alreadySubmitted) {
        toast.success("Score is already securely recorded in GDSC standings! ✨", { id: "auto-submit" });
      } else {
        toast.success("Score auto-submitted! Refreshing standings... 🚀", { id: "auto-submit" });
        setTimeout(() => syncGlobalLeaderboard(true), 1500);
      }
    } else {
      toast.error(res.message, { id: "auto-submit" });
    }
  };

  const handleAutoSubmitClick = () => {
    if (!playerEmail) {
      setShowDetailsModal(true);
      return;
    }
    executeAutoSubmit();
  };

  // Sync with global Google Sheet / Excel CSV feed
  const syncGlobalLeaderboard = useCallback(async (isManual = false) => {
    setIsSyncing(true);
    setSyncError(null);
    setSyncStatusInfo(null);
    let toastId = null;
    if (isManual) {
      toastId = toast.loading("Syncing standings with Google Sheets...", { id: "sheet-sync" });
    }
    try {
      const csvUrl = CONFIG.LEADERBOARD_CSV_URL || "/leaderboard.csv";
      const sep = csvUrl.includes("?") ? "&" : "?";
      const fetchUrl = `${csvUrl}${sep}_t=${Date.now()}`;
      const res = await fetch(fetchUrl, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to fetch spreadsheet feed (HTTP ${res.status})`);
      }
      const rawText = await res.text();
      const parsed = parseLeaderboardCSV(rawText);

      if (parsed.length > 0) {
        setGlobalEntries(parsed);
        setSyncStatusInfo({
          type: "success",
          count: parsed.length,
          msg: `Synced ${parsed.length} live submissions directly from Google Sheets!`,
        });
        if (isManual) {
          toast.success(`Synced ${parsed.length} live teams from Google Sheets! 🏆`, { id: "sheet-sync" });
        }
      } else {
        // Fallback to local entries if CSV was empty
        setGlobalEntries(leaderboard);
        setSyncStatusInfo({
          type: "empty",
          count: 0,
          msg: "Connected to Google Sheet, but 0 team submissions were found yet. Showing baseline demo standings until the first form response is submitted.",
        });
        if (isManual) {
          toast("Google Sheet connected (0 submissions yet). Showing baseline standings.", {
            id: "sheet-sync",
            icon: "ℹ️",
          });
        }
      }
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      console.warn("Global spreadsheet sync fallback to local store:", err);
      setSyncError("Spreadsheet feed unreachable; displaying cached campus rankings.");
      setGlobalEntries(leaderboard);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      if (isManual) {
        toast.error("Spreadsheet unreachable. Showing cached rankings.", { id: "sheet-sync" });
      }
    } finally {
      setIsSyncing(false);
    }
  }, [leaderboard]);

  // Initial auto-sync on page load
  useEffect(() => {
    syncGlobalLeaderboard();
  }, [syncGlobalLeaderboard]);

  const currentEntries = activeTab === "global" ? globalEntries : leaderboard;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
            <span>🏆</span> Hall of Valor & Live Standings
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-100">
            Navshakti Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Synced directly with the official GDSC NIT AP evaluation spreadsheet.
          </p>
        </div>

        {/* Action Controls: Form link & Export */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 1-Click Instant Auto-Submit */}
          <button
            onClick={handleAutoSubmitClick}
            disabled={isAutoSubmitting}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.45)] border border-emerald-300/60 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            title="Automatically post score into the linked Google Sheet"
          >
            <span>⚡</span>
            <span>{isAutoSubmitting ? "Submitting..." : "Auto-Submit My Score"}</span>
          </button>

          {/* Participant Details Collection Modal before auto-submitting */}
          <ParticipantDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            onConfirm={executeAutoSubmit}
            isSubmitting={isAutoSubmitting}
          />

          {CONFIG.GOOGLE_FORM_URL && (
            <a
              href={CONFIG.GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold glass-card hover:bg-white/10 text-amber-200 border border-amber-500/40 hover:scale-105 active:scale-95 transition-all"
              title="Open Google Form manually in a new tab"
            >
              <span>📝</span>
              <span>Manual Form →</span>
            </a>
          )}
          <button
            onClick={() => {
              exportLeaderboardToCSV(currentEntries, `gdsc_navshakti_leaderboard_${activeTab}.csv`);
              toast.success(`Exported ${currentEntries.length} teams to spreadsheet! 📥`);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium glass-card hover:bg-white/10 text-slate-200 border border-slate-700 cursor-pointer active:scale-95 transition-all"
            title="Download current standings as Excel / CSV spreadsheet"
          >
            <span>📥</span>
            <span>Export to Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Your Current Live Stats Banner */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-purple-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white p-1 border border-amber-500/40 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
            <img src="/gdsc-logo.png" alt="GDSC NIT AP" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-amber-400 font-bold">Your Active Quest Telemetry:</div>
            <h3 className="font-serif text-lg font-bold text-slate-100">
              {playerName || "Anonymous Defender"}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {completedDays.length} / 9 Powers Restored
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono self-end sm:self-auto">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Your Score</span>
            <span className="text-xl font-bold text-amber-400">{totalScore} pts</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Elapsed Time</span>
            <span className="text-xl font-bold text-emerald-400">{formatTime(totalTimeSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Tabs and Sync Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => setActiveTab("global")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "global"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🌐 Global Campus Standings (Live Spreadsheet)
          </button>
          <button
            onClick={() => setActiveTab("local")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "local"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📱 Local Device History
          </button>
        </div>

        <div className="flex items-center gap-3">
          {lastSyncedTime && (
            <span className="text-[11px] font-mono text-slate-400">
              Synced: <strong className="text-slate-300">{lastSyncedTime}</strong>
            </span>
          )}
          <button
            onClick={() => syncGlobalLeaderboard(true)}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
          >
            <span className={isSyncing ? "animate-spin inline-block" : ""}>🔄</span>
            <span>{isSyncing ? "Syncing..." : "Sync Live Standings"}</span>
          </button>
        </div>
      </div>

      {syncError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{syncError}</span>
        </div>
      )}

      {syncStatusInfo && !syncError && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all ${
            syncStatusInfo.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-sky-500/10 border-sky-500/30 text-sky-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{syncStatusInfo.type === "success" ? "✅" : "ℹ️"}</span>
            <span>{syncStatusInfo.msg}</span>
          </div>
          <span className="shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
            {syncStatusInfo.type === "success" ? "Live Stream Active" : "Sheet Empty"}
          </span>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="glass-card rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>{activeTab === "global" ? "🌐 Google Sheets Live Rankings" : "📱 Device Local Standings"}</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {currentEntries.length} Teams Ranked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[640px]">
            <thead className="bg-black/50 text-slate-400 border-b border-slate-800 font-mono text-xs whitespace-nowrap">
              <tr>
                <th className="p-3 sm:p-4 w-16 text-center">Rank</th>
                <th className="p-3 sm:p-4">Team / Defender Name</th>
                <th className="p-3 sm:p-4 text-center">Total Score</th>
                <th className="p-3 sm:p-4 text-center">Time Taken</th>
                <th className="p-3 sm:p-4 text-center">Verification Status</th>
                <th className="p-3 sm:p-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {currentEntries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No leaderboard entries found yet. Submit your score through the Google Form to rank first!
                  </td>
                </tr>
              ) : (
                currentEntries.map((entry, index) => {
                  const isCurrentUser =
                    playerName &&
                    entry.name.toLowerCase() === playerName.toLowerCase();

                  return (
                    <tr
                      key={index}
                      className={`transition-colors ${
                        isCurrentUser
                          ? "bg-amber-500/15 text-slate-100 font-semibold"
                          : "hover:bg-white/5 text-slate-300"
                      }`}
                    >
                      <td className="p-3 sm:p-4 text-center font-mono font-bold text-base">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </td>
                      <td className="p-3 sm:p-4 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-100 font-bold">{entry.name}</span>
                          {isCurrentUser && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 text-center font-mono font-bold text-amber-400 text-sm">
                        {entry.score} pts
                      </td>
                      <td className="p-3 sm:p-4 text-center font-mono text-slate-400">
                        {formatTime(entry.timeSeconds)}
                      </td>
                      <td className="p-3 sm:p-4 text-center font-mono">
                        {entry.token ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono" title={`Verified Token: ${entry.token}`}>
                            ✓ {entry.token}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Verified</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-right font-mono text-[11px] text-slate-400">
                        {entry.date}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Instructions for Organizers */}
      {/* <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2 text-xs text-slate-400">
        <div className="font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-2">
          <span>💡</span> How Global Spreadsheet Sync Works
        </div>
        <p>
          Organizers link their Google Form to a Google Sheet, click <strong className="text-slate-200">File → Share → Publish to web → CSV</strong>, and paste the link into <code className="text-amber-400">.env</code> as <code className="text-amber-400">VITE_LEADERBOARD_CSV_URL</code>. Any new submissions automatically appear here when participants click <strong>Sync Live Standings</strong>!
        </p>
      </div> */}

    </div>
  );
};
