import React, { createContext, useContext, useState, useEffect } from "react";
import { CONFIG } from "../config";
import { DAYS_DATA } from "../data/days";
import { playBellSound, playCelebrationFanfare, playDholBeat } from "../utils/sound";
import {
  safeParseJSON,
  sanitizeInput,
  rateLimiter,
  generateIntegritySignature,
  verifyIntegritySignature,
  generateVerificationToken,
} from "../utils/security";

const STORAGE_KEY = "gdsc_navshakti_state_2026";
const LEADERBOARD_KEY = "gdsc_navshakti_leaderboard_2026";
const LEGACY_STORAGE_KEY = "gdac_navshakti_state_2026";

const GameContext = createContext(null);

const DEFAULT_STATE = {
  playerName: "",
  completedDays: [],
  dayScores: {},
  hintsUsed: {},
  wrongAttempts: {},
  clues: {},
  startTime: Date.now(),
  totalTimeSeconds: 0,
  isSoundMuted: true, // sound-free by default
};

export const GameProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      const parsedEnvelope = safeParseJSON(savedRaw, null);

      let parsed = parsedEnvelope;
      let isTampered = false;

      // Inspect for tamper-seal signature envelope
      if (parsedEnvelope && typeof parsedEnvelope === "object" && parsedEnvelope.state && parsedEnvelope._sig) {
        const isValid = verifyIntegritySignature(parsedEnvelope.state, parsedEnvelope._sig);
        if (!isValid) {
          console.warn(
            "[Security Barrier] Tampering detected in localStorage state! Cryptographic signature mismatch. Enforcing strict bounds normalization."
          );
          isTampered = true;
        }
        parsed = parsedEnvelope.state;
      }

      if (!parsed || typeof parsed !== "object") {
        return DEFAULT_STATE;
      }

      // 1. Strict Completion Sequence Validation:
      // In production mode, days cannot be completed out of sequence
      const rawCompleted = Array.isArray(parsed.completedDays)
        ? parsed.completedDays.filter((n) => typeof n === "number" && n >= 1 && n <= 9)
        : [];
      const sortedCompleted = [...new Set(rawCompleted)].sort((a, b) => a - b);
      
      let validatedCompleted = [];
      if (CONFIG.UNLOCK_ALL) {
        validatedCompleted = sortedCompleted;
      } else {
        for (let i = 1; i <= 9; i++) {
          if (sortedCompleted.includes(i)) {
            validatedCompleted.push(i);
          } else {
            // Discontinuity: cannot skip days
            break;
          }
        }
      }

      // 2. Strict Score Bounds Clamping:
      // Scores must never exceed BASE_DAY_SCORE (100) or drop below MIN_DAY_SCORE (40)
      const sanitizedScores = {};
      if (parsed.dayScores && typeof parsed.dayScores === "object") {
        for (let d = 1; d <= 9; d++) {
          if (parsed.dayScores[d] !== undefined) {
            const numScore = Number(parsed.dayScores[d]);
            if (!isNaN(numScore) && validatedCompleted.includes(d)) {
              sanitizedScores[d] = Math.min(CONFIG.BASE_DAY_SCORE, Math.max(CONFIG.MIN_DAY_SCORE, numScore));
            }
          }
        }
      }

      // 3. Strict Clues Validation:
      // Clues must match known official day tokens and only for completed days
      const sanitizedClues = {};
      DAYS_DATA.forEach((d) => {
        if (validatedCompleted.includes(d.day)) {
          sanitizedClues[d.day] = d.clueValue;
        }
      });

      return {
        playerName: sanitizeInput(parsed.playerName || "", 30),
        completedDays: validatedCompleted,
        dayScores: sanitizedScores,
        hintsUsed: parsed.hintsUsed && typeof parsed.hintsUsed === "object" ? parsed.hintsUsed : {},
        wrongAttempts: parsed.wrongAttempts && typeof parsed.wrongAttempts === "object" ? parsed.wrongAttempts : {},
        clues: sanitizedClues,
        startTime: typeof parsed.startTime === "number" && parsed.startTime > 0 ? parsed.startTime : Date.now(),
        totalTimeSeconds: typeof parsed.totalTimeSeconds === "number" && parsed.totalTimeSeconds >= 0 ? parsed.totalTimeSeconds : 0,
        isSoundMuted: typeof parsed.isSoundMuted === "boolean" ? parsed.isSoundMuted : true,
      };
    } catch (e) {
      console.error("Failed to load local game state", e);
      return DEFAULT_STATE;
    }
  });

  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const savedRaw = localStorage.getItem(LEADERBOARD_KEY);
      const parsed = safeParseJSON(savedRaw, null);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 50); // clamp leaderboard length
      }
    } catch (e) {
      console.error("Failed to load leaderboard", e);
    }
    return [
      { name: "Team Garuda (GDSC Leads)", score: 900, timeSeconds: 430, date: "2026-10-15" },
      { name: "Cyber Shakti Devs", score: 875, timeSeconds: 610, date: "2026-10-16" },
      { name: "Garba Coders Squad", score: 840, timeSeconds: 780, date: "2026-10-16" },
    ];
  });

  // Save sealed state with cryptographic tamper-seal envelope
  useEffect(() => {
    try {
      const signature = generateIntegritySignature(state);
      const envelope = {
        state,
        _sig: signature,
        _v: 2,
        _updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    } catch (e) {
      console.error("Failed to persist sealed game state", e);
    }
  }, [state]);

  // Save leaderboard on change
  useEffect(() => {
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    } catch (e) {
      console.error("Failed to persist leaderboard", e);
    }
  }, [leaderboard]);

  // Timer loop: track elapsed time while quest is ongoing
  useEffect(() => {
    const isCompleted = state.completedDays.length >= CONFIG.TOTAL_DAYS;
    if (isCompleted) return;

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        totalTimeSeconds: (prev.totalTimeSeconds || 0) + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [state.completedDays.length]);

  const setPlayerName = (name) => {
    const clean = sanitizeInput(name || "", 30);
    setState((prev) => ({ ...prev, playerName: clean }));
  };

  const toggleSound = () => {
    setState((prev) => {
      const nextMuted = !prev.isSoundMuted;
      if (!nextMuted) {
        playBellSound(false);
      }
      return { ...prev, isSoundMuted: nextMuted };
    });
  };

  const isDayUnlocked = (dayNum) => {
    if (CONFIG.UNLOCK_ALL) return true;
    if (dayNum === 1) return true;
    if (dayNum === 9) {
      return [1, 2, 3, 4, 5, 6, 7, 8].every((d) => state.completedDays.includes(d));
    }
    return state.completedDays.includes(dayNum - 1);
  };

  const useHint = (dayNum) => {
    if (state.hintsUsed[dayNum]) return;
    setState((prev) => ({
      ...prev,
      hintsUsed: { ...prev.hintsUsed, [dayNum]: true },
    }));
  };

  const recordWrongAttempt = (dayNum) => {
    // Rate limit recording of wrong attempts to avoid console spam loops
    const check = rateLimiter.checkLimit(`wrong_attempt_${dayNum}`, 10, 5);
    if (!check.allowed) {
      console.warn("Rate limit active: Attempt flood throttled");
      return;
    }

    setState((prev) => {
      const current = prev.wrongAttempts[dayNum] || 0;
      return {
        ...prev,
        wrongAttempts: { ...prev.wrongAttempts, [dayNum]: current + 1 },
      };
    });
  };

  const calculateDayScore = (dayNum) => {
    if (state.dayScores[dayNum]) {
      return state.dayScores[dayNum];
    }
    const hintPenalty = state.hintsUsed[dayNum] ? CONFIG.HINT_PENALTY : 0;
    const wrongPenalty = (state.wrongAttempts[dayNum] || 0) * CONFIG.WRONG_ATTEMPT_PENALTY;
    const calculated = CONFIG.BASE_DAY_SCORE - hintPenalty - wrongPenalty;
    return Math.max(CONFIG.MIN_DAY_SCORE, calculated);
  };

  const completeDay = (dayNum, customScore = null) => {
    // Rate limit completeDay to prevent automated loop exploitation
    const rateCheck = rateLimiter.checkLimit(`complete_day_${dayNum}`, 2, 5);
    if (!rateCheck.allowed && state.completedDays.includes(dayNum)) {
      return;
    }

    const dayData = DAYS_DATA.find((d) => d.day === dayNum);
    const scoreEarned = customScore !== null ? customScore : calculateDayScore(dayNum);
    const clueVal = dayData ? dayData.clueValue : "RECOVERED";

    if (!state.isSoundMuted) {
      if (dayNum === 9) {
        playCelebrationFanfare(false);
      } else {
        playDholBeat(false);
        setTimeout(() => playBellSound(false), 200);
      }
    }

    setState((prev) => {
      const newCompleted = prev.completedDays.includes(dayNum)
        ? prev.completedDays
        : [...prev.completedDays, dayNum];

      const newScores = {
        ...prev.dayScores,
        [dayNum]: prev.dayScores[dayNum] || scoreEarned,
      };

      const newClues = {
        ...prev.clues,
        [dayNum]: clueVal,
      };

      // If Day 9 completed, add to leaderboard with sanitized entries
      if (dayNum === 9 && !prev.completedDays.includes(9)) {
        const total = Object.values(newScores).reduce((a, b) => a + b, 0);
        const cleanName = sanitizeInput(prev.playerName || "Valiant Volunteer", 30);
        const entry = {
          name: cleanName,
          score: typeof total === "number" ? total : 900,
          timeSeconds: typeof prev.totalTimeSeconds === "number" ? prev.totalTimeSeconds : 600,
          date: new Date().toISOString().split("T")[0],
        };
        setLeaderboard((old) => [entry, ...old].slice(0, 50).sort((a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds));
      }

      return {
        ...prev,
        completedDays: newCompleted,
        dayScores: newScores,
        clues: newClues,
      };
    });
  };

  const resetProgress = () => {
    const fresh = {
      playerName: state.playerName,
      completedDays: [],
      dayScores: {},
      hintsUsed: {},
      wrongAttempts: {},
      clues: {},
      startTime: Date.now(),
      totalTimeSeconds: 0,
      isSoundMuted: state.isSoundMuted,
    };
    setState(fresh);
    try {
      const sig = generateIntegritySignature(fresh);
      const envelope = {
        state: fresh,
        _sig: sig,
        _v: 2,
        _updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    } catch (e) {
      console.error(e);
    }
  };

  const totalScore = Object.values(state.dayScores).reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0);
  const systemIntegrity = Math.round((state.completedDays.length / CONFIG.TOTAL_DAYS) * 100);
  const isAllRestored = state.completedDays.length >= CONFIG.TOTAL_DAYS;
  const verificationToken = generateVerificationToken(state.playerName, totalScore, state.totalTimeSeconds || 0);

  return (
    <GameContext.Provider
      value={{
        playerName: state.playerName,
        setPlayerName,
        completedDays: state.completedDays,
        dayScores: state.dayScores,
        hintsUsed: state.hintsUsed,
        wrongAttempts: state.wrongAttempts,
        clues: state.clues,
        totalTimeSeconds: state.totalTimeSeconds || 0,
        isSoundMuted: state.isSoundMuted,
        toggleSound,
        isDayUnlocked,
        useHint,
        recordWrongAttempt,
        calculateDayScore,
        completeDay,
        resetProgress,
        totalScore,
        systemIntegrity,
        isAllRestored,
        verificationToken,
        leaderboard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
