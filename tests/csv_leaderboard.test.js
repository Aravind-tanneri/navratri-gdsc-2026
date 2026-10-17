import { describe, it, expect } from "vitest";
import { parseLeaderboardCSV } from "../src/utils/csv";

describe("Leaderboard CSV / Excel Sync Test Suite", () => {
  it("parses standard Google Sheet / Excel CSV export and orders by score and time", () => {
    const rawCSV = `Timestamp,Team Name,Score,Time (seconds),Verification Token
2026-10-15 14:22:01,Team Garuda,900,430,UTSAV-900-T430-8A1F
2026-10-16 16:05:12,Cyber Shakti,875,610,UTSAV-875-T610-3C9D
2026-10-16 19:40:55,Garba Coders,900,390,UTSAV-900-T390-E45A`;

    const parsed = parseLeaderboardCSV(rawCSV);
    expect(parsed).toHaveLength(3);

    // Garba Coders has 900 pts with 390s, so they should rank #1 ahead of Team Garuda (900 pts in 430s)
    expect(parsed[0].name).toBe("Garba Coders");
    expect(parsed[0].score).toBe(900);
    expect(parsed[0].timeSeconds).toBe(390);

    expect(parsed[1].name).toBe("Team Garuda");
    expect(parsed[1].score).toBe(900);

    expect(parsed[2].name).toBe("Cyber Shakti");
    expect(parsed[2].score).toBe(875);
  });

  it("handles alternative column headers like Points, Duration, or Player", () => {
    const customCSV = `Date,Player,Points,Duration,Hash
2026-10-17,Alpha Squad,850,520,UTSAV-850-T520-1122`;

    const parsed = parseLeaderboardCSV(customCSV);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe("Alpha Squad");
    expect(parsed[0].score).toBe(850);
    expect(parsed[0].timeSeconds).toBe(520);
    expect(parsed[0].token).toBe("UTSAV-850-T520-1122");
  });

  it("safely handles empty or corrupted CSV files without crashing", () => {
    expect(parseLeaderboardCSV("")).toEqual([]);
    expect(parseLeaderboardCSV(null)).toEqual([]);
    expect(parseLeaderboardCSV("random single header line")).toEqual([]);
  });
});
