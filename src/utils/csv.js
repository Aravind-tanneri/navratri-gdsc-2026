// Utility for parsing and exporting Leaderboard CSV / Excel files

import { sanitizeInput } from "./security";

/**
 * Parses raw CSV string into structured leaderboard entries
 * Handles standard Google Forms / Google Sheets CSV exports
 * @param {string} csvText - Raw CSV text
 * @returns {Array<{ name: string, score: number, timeSeconds: number, date: string, token: string }>}
 */
export const parseLeaderboardCSV = (csvText) => {
  if (!csvText || typeof csvText !== "string") return [];

  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  // Parse header row
  const headerCells = splitCsvRow(lines[0]).map((h) => h.toLowerCase().trim());

  // Detect column indices dynamically
  const nameIdx = headerCells.findIndex((h) => h.includes("team") || h.includes("name") || h.includes("player"));
  const scoreIdx = headerCells.findIndex((h) => h.includes("score") || h.includes("pts") || h.includes("points"));
  const timeIdx = headerCells.findIndex((h) => (!h.includes("stamp") && h.includes("time")) || h.includes("second") || h.includes("duration"));
  const dateIdx = headerCells.findIndex((h) => h.includes("date") || h.includes("timestamp"));
  const tokenIdx = headerCells.findIndex((h) => h.includes("token") || h.includes("verification") || h.includes("hash"));

  const entries = [];

  for (let i = 1; i < lines.length; i++) {
    const row = splitCsvRow(lines[i]);
    if (row.length < 2) continue;

    const rawName = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : row[1] || "Anonymous";
    const rawScore = scoreIdx !== -1 && row[scoreIdx] ? row[scoreIdx] : row[2] || "0";
    const rawTime = timeIdx !== -1 && row[timeIdx] ? row[timeIdx] : row[3] || "600";
    const rawDate = dateIdx !== -1 && row[dateIdx] ? row[dateIdx] : row[0] || new Date().toISOString().split("T")[0];
    const rawToken = tokenIdx !== -1 && row[tokenIdx] ? row[tokenIdx] : row[4] || "";

    const name = sanitizeInput(rawName, 30);
    const scoreNum = parseInt(rawScore.replace(/[^\d]/g, ""), 10);
    const score = !isNaN(scoreNum) ? Math.min(900, Math.max(0, scoreNum)) : 0;

    // Convert time string (e.g. 430 or 7m 10s)
    let timeSeconds = 600;
    if (typeof rawTime === "string") {
      if (rawTime.includes("m") || rawTime.includes("s")) {
        const m = rawTime.match(/(\d+)\s*m/);
        const s = rawTime.match(/(\d+)\s*s/);
        timeSeconds = (m ? parseInt(m[1], 10) * 60 : 0) + (s ? parseInt(s[1], 10) : 0);
      } else {
        const parsedSec = parseInt(rawTime.replace(/[^\d]/g, ""), 10);
        if (!isNaN(parsedSec)) timeSeconds = parsedSec;
      }
    }

    const dateClean = rawDate.split(" ")[0].slice(0, 10);
    const tokenClean = sanitizeInput(rawToken, 25);

    if (name) {
      entries.push({
        name,
        score,
        timeSeconds,
        date: dateClean || new Date().toISOString().split("T")[0],
        token: tokenClean,
      });
    }
  }

  // Deduplicate entries by token and team name (keeps each team's single best score / lowest time)
  const uniqueMap = new Map();
  for (const entry of entries) {
    const key = entry.name.toLowerCase().trim();
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, entry);
    } else {
      const existing = uniqueMap.get(key);
      // Keep higher score, or lower elapsed time on tie
      if (
        entry.score > existing.score ||
        (entry.score === existing.score && entry.timeSeconds < existing.timeSeconds)
      ) {
        uniqueMap.set(key, entry);
      }
    }
  }

  const deduplicated = Array.from(uniqueMap.values());

  // Sort descending by score, ascending by time taken
  return deduplicated.sort((a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds);
};

/**
 * Split a single CSV line respecting quotes
 */
function splitCsvRow(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ""));
  return result;
}

/**
 * Download leaderboard as a CSV / Excel file
 * @param {Array} entries - Leaderboard entries
 * @param {string} filename - Output filename
 */
export const exportLeaderboardToCSV = (entries, filename = "navshakti_leaderboard.csv") => {
  if (!Array.isArray(entries) || entries.length === 0) return;

  const headers = ["Rank", "Team Name", "Total Score (PTS)", "Time (Seconds)", "Date", "Verification Token"];
  const rows = entries.map((e, idx) => [
    idx + 1,
    `"${(e.name || "").replace(/"/g, '""')}"`,
    e.score || 0,
    e.timeSeconds || 0,
    `"${e.date || ""}"`,
    `"${e.token || ""}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
