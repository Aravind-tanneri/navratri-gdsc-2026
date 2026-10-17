import React, { useState, useMemo } from "react";
import { useGame } from "../context/GameContext";
import { sanitizeInput, rateLimiter } from "../utils/security";

const LOG_ENTRIES = [
  { id: 101, time: "08:14:02", ip: "192.168.1.15", user: "garba_sound_tech", method: "GET", path: "/stage/audio-mixer/status", status: 200, isMalicious: false },
  { id: 102, time: "08:22:19", ip: "10.0.4.50", user: "food_stall_lead", method: "POST", path: "/api/canteen/token-dispense", status: 200, isMalicious: false },
  { id: 103, time: "09:05:44", ip: "172.16.0.8", user: "volunteer_priya", method: "GET", path: "/volunteers/schedule", status: 200, isMalicious: false },
  { id: 104, time: "10:11:00", ip: "192.168.1.20", user: "prasad_coordinator", method: "GET", path: "/prasad/coupons/summary", status: 200, isMalicious: false },
  { id: 105, time: "11:45:12", ip: "10.0.2.14", user: "lighting_desk", method: "PUT", path: "/pandal/led-patterns/aarti", status: 200, isMalicious: false },
  { id: 106, time: "13:20:33", ip: "192.168.1.99", user: "attendee_wifi", method: "GET", path: "/portal/splash-screen", status: 200, isMalicious: false },
  { id: 107, time: "14:15:08", ip: "172.16.0.22", user: "gdsc_treasurer", method: "GET", path: "/finance/passes-sold", status: 200, isMalicious: false },
  { id: 108, time: "15:30:41", ip: "10.0.1.5", user: "stage_manager", method: "POST", path: "/stage/mc-announcement", status: 200, isMalicious: false },
  { id: 109, time: "17:04:19", ip: "192.168.1.18", user: "security_guard", method: "POST", path: "/gate/turnstile/rfid-check", status: 200, isMalicious: false },
  { id: 110, time: "18:40:55", ip: "192.168.1.22", user: "garba_judge_1", method: "POST", path: "/contests/garba-score", status: 200, isMalicious: false },
  { id: 111, time: "19:12:03", ip: "172.16.0.10", user: "dandiya_counter", method: "GET", path: "/inventory/sticks-count", status: 200, isMalicious: false },
  { id: 112, time: "21:05:44", ip: "192.168.1.33", user: "live_stream_bot", method: "POST", path: "/stream/youtube/heartbeat", status: 200, isMalicious: false },
  { id: 113, time: "22:50:11", ip: "10.0.3.11", user: "cleanup_crew", method: "GET", path: "/facility/gate-lock-status", status: 200, isMalicious: false },
  
  // Malicious 1: Repeated failed brute-force attacks at 03:42 AM
  { id: 114, time: "03:42:15", ip: "198.51.100.88", user: "mahishasur_bot", method: "POST", path: "/api/auth/login?brute=1", status: 401, isMalicious: true, flagDesc: "Brute-force credential attack from external IP" },
  { id: 115, time: "03:42:18", ip: "198.51.100.88", user: "mahishasur_bot", method: "POST", path: "/api/auth/login?brute=2", status: 401, isMalicious: false },
  { id: 116, time: "03:42:22", ip: "198.51.100.88", user: "mahishasur_bot", method: "POST", path: "/api/auth/login?brute=3", status: 401, isMalicious: false },
  
  // Malicious 2: Odd-hour unauthorized privilege escalation creating a rogue superuser
  { id: 117, time: "03:43:05", ip: "198.51.100.88", user: "mahishasur_bot", method: "POST", path: "/api/admin/create-super-user", status: 200, isMalicious: true, flagDesc: "Rogue superuser injected at 03:43 AM" },
  
  { id: 118, time: "03:43:40", ip: "127.0.0.1", user: "cron_backup", method: "GET", path: "/system/health-check", status: 200, isMalicious: false },
  { id: 119, time: "03:44:00", ip: "127.0.0.1", user: "cron_backup", method: "POST", path: "/system/cleanup-tmp", status: 200, isMalicious: false },
  
  // Malicious 3: Database exfiltration payload
  { id: 120, time: "03:44:22", ip: "198.51.100.88", user: "mahishasur_bot", method: "GET", path: "/api/db/export?table=dandiya_booking", status: 200, isMalicious: true, flagDesc: "Exfiltration dump of Dandiya Booking Database" },
  
  { id: 121, time: "03:45:10", ip: "10.0.9.1", user: "network_dhcp", method: "GET", path: "/network/lease-renew", status: 200, isMalicious: false },
  { id: 122, time: "04:10:02", ip: "192.168.1.15", user: "garba_sound_tech", method: "GET", path: "/stage/audio-mixer/sleep", status: 200, isMalicious: false },
  { id: 123, time: "05:00:15", ip: "172.16.0.4", user: "morning_priest", method: "GET", path: "/puja/chants-schedule", status: 200, isMalicious: false },
  { id: 124, time: "06:15:30", ip: "10.0.1.2", user: "gate_keeper_morning", method: "GET", path: "/gate/entry-counter", status: 200, isMalicious: false },
  { id: 125, time: "07:00:00", ip: "127.0.0.1", user: "uptime_monitor", method: "GET", path: "/ping", status: 200, isMalicious: false },
];

export const Day7 = ({ dayData, onSuccess }) => {
  const { recordWrongAttempt } = useGame();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLogIds, setSelectedLogIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const cleanSearch = sanitizeInput(searchQuery, 40);

  const filteredLogs = useMemo(() => {
    return LOG_ENTRIES.filter((log) => {
      const q = cleanSearch.toLowerCase();
      const matchesSearch =
        !q ||
        log.ip.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.path.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" || log.status.toString() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [cleanSearch, statusFilter]);

  const toggleSelectLog = (id) => {
    setErrorMessage("");
    setSelectedLogIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAnalyzeLogs = () => {
    // Rate limit: max 4 attempts per 6 seconds
    const limit = rateLimiter.checkLimit("day7_analyze", 4, 6);
    if (!limit.allowed) {
      setErrorMessage(`Rate limit: Forensic correlation busy. Please wait ${limit.retryAfterSeconds}s.`);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    const maliciousIds = LOG_ENTRIES.filter((l) => l.isMalicious).map((l) => l.id); // [114, 117, 120]
    const selectedMalicious = selectedLogIds.filter((id) => maliciousIds.includes(id));
    const selectedBenign = selectedLogIds.filter((id) => !maliciousIds.includes(id));

    if (selectedMalicious.length === 3 && selectedBenign.length === 0) {
      setErrorMessage("");
      onSuccess();
    } else {
      recordWrongAttempt(7);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      if (selectedBenign.length > 0) {
        setErrorMessage(
          "False positives detected! You flagged benign operations (like sound mixers or cron backups). Focus on odd-hour unauthorized attacks!"
        );
      } else {
        setErrorMessage(
          `You identified ${selectedMalicious.length} of 3 primary threat footprints. Notice the repeated 03:42 AM activity from foreign IP 198.51.100.88!`
        );
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="terminal-panel rounded-2xl border border-indigo-500/50 p-4 sm:p-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
        
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-500/30 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <h4 className="text-sm font-bold text-indigo-300">
                SIEM Forensic Audit Terminal // kalaratri-v4.log
              </h4>
              <p className="text-xs text-slate-400">
                Filter and isolate the 3 signature attacker footprints amidst 25 event records.
              </p>
            </div>
          </div>
          <div className="text-xs text-indigo-400 border border-indigo-500/40 px-3 py-1 rounded bg-indigo-950/40">
            {selectedLogIds.length} Selected / Target: 3 Footprints
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="my-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by IP (e.g. 198.51), UserAgent, or endpoint path..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/80 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Status:</span>
            {["ALL", "200", "401"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setStatusFilter(code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  statusFilter === code
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Log Viewer Scrollable Table */}
        <div className="border border-slate-800 rounded-xl bg-black/80 overflow-x-auto max-h-[380px] font-mono text-[11px] select-none">
          <table className="w-full text-left border-collapse min-w-[580px]">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 sticky top-0 whitespace-nowrap">
              <tr>
                <th className="p-2.5 w-10 text-center">Sel</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Source IP</th>
                <th className="p-2.5">Agent / User</th>
                <th className="p-2.5">Method</th>
                <th className="p-2.5">Path</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredLogs.map((log) => {
                const isSelected = selectedLogIds.includes(log.id);
                return (
                  <tr
                    key={log.id}
                    onClick={() => toggleSelectLog(log.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-indigo-950/70 text-indigo-200"
                        : "hover:bg-slate-900/40 text-slate-300"
                    }`}
                  >
                    <td className="p-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded accent-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-2.5 text-slate-400">{log.time}</td>
                    <td className="p-2.5 text-amber-300 font-medium">{log.ip}</td>
                    <td className="p-2.5 text-slate-200">{log.user}</td>
                    <td className="p-2.5 font-bold text-slate-400">{log.method}</td>
                    <td className="p-2.5 text-slate-300 truncate max-w-[200px]">{log.path}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 200
                            ? "bg-emerald-950 text-emerald-400"
                            : "bg-rose-950 text-rose-400"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Error / Feedback Message */}
        {errorMessage && (
          <div
            className={`mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/60 text-xs text-rose-300 flex items-start gap-2 ${
              isShaking ? "animate-[shake_0.4s_ease-in-out]" : ""
            }`}
          >
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Tip: Correlate timestamps around 03:42 AM with unauthorized admin privileges.
          </span>
          <button
            type="button"
            onClick={handleAnalyzeLogs}
            disabled={selectedLogIds.length === 0}
            className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white disabled:opacity-40 shadow-[0_0_24px_rgba(99,102,241,0.55)] border border-indigo-300/50 hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono"
          >
            Correlate Threat Signatures →
          </button>
        </div>

      </div>
    </div>
  );
};
