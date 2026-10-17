import { describe, it, expect } from "vitest";
import {
  sanitizeInput,
  safeParseJSON,
  rateLimiter,
  generateIntegritySignature,
  verifyIntegritySignature,
  generateVerificationToken,
} from "../src/utils/security";
import { CONFIG } from "../src/config";

describe("Security & Scoring Verification Test Suite", () => {
  describe("Input Sanitization & Script Crash Defense", () => {
    it("strips HTML script tags to prevent XSS injection", () => {
      const malicious = '<script>alert("hack")</script>Team Alpha';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain("<script>");
      expect(clean).not.toContain("</script>");
      expect(clean).toBe("Team Alpha");
    });

    it("enforces max length constraints", () => {
      const longInput = "A".repeat(100);
      const clean = sanitizeInput(longInput, 20);
      expect(clean).toHaveLength(20);
    });

    it("safely handles non-string inputs", () => {
      expect(sanitizeInput(null)).toBe("");
      expect(sanitizeInput(undefined)).toBe("");
      expect(sanitizeInput(12345)).toBe("12345");
      expect(sanitizeInput({})).toBe("");
    });
  });

  describe("Safe JSON Parsing", () => {
    it("parses valid JSON accurately", () => {
      const raw = JSON.stringify({ completedDays: [1, 2], score: 200 });
      const parsed = safeParseJSON(raw, {});
      expect(parsed.completedDays).toEqual([1, 2]);
      expect(parsed.score).toBe(200);
    });

    it("gracefully falls back to fallback default on corrupted data without throwing", () => {
      const corrupted = "{ bad: JSON payload ...";
      const fallback = { fallback: true };
      const parsed = safeParseJSON(corrupted, fallback);
      expect(parsed).toEqual(fallback);
    });
  });

  describe("Sliding Window Rate Limiter", () => {
    it("allows requests under the rate limit threshold", () => {
      const key = "test_action_allowed";
      const result1 = rateLimiter.checkLimit(key, 3, 5);
      const result2 = rateLimiter.checkLimit(key, 3, 5);
      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
    });

    it("blocks and throttles brute-force attempts exceeding threshold", () => {
      const key = "test_action_blocked";
      rateLimiter.checkLimit(key, 2, 5);
      rateLimiter.checkLimit(key, 2, 5);
      const third = rateLimiter.checkLimit(key, 2, 5);
      expect(third.allowed).toBe(false);
      expect(third.remainingAttempts).toBe(0);
      expect(third.retryAfterSeconds).toBeGreaterThan(0);
    });
  });

  describe("Scoring Logic & Minimum Score Floor", () => {
    const calculateScore = (hintsUsed, wrongAttemptsCount) => {
      const hintPenalty = hintsUsed ? CONFIG.HINT_PENALTY : 0;
      const wrongPenalty = wrongAttemptsCount * CONFIG.WRONG_ATTEMPT_PENALTY;
      const calculated = CONFIG.BASE_DAY_SCORE - hintPenalty - wrongPenalty;
      return Math.max(CONFIG.MIN_DAY_SCORE, calculated);
    };

    it("awards 100 points on a flawless first attempt", () => {
      expect(calculateScore(false, 0)).toBe(100);
    });

    it("deducts 5 points for taking a hint", () => {
      expect(calculateScore(true, 0)).toBe(95);
    });

    it("deducts 5 points per incorrect attempt", () => {
      expect(calculateScore(false, 2)).toBe(90);
    });

    it("guarantees the minimum protected floor of 40 pts even after 30 wrong attempts", () => {
      expect(calculateScore(true, 30)).toBe(40);
      expect(calculateScore(false, 50)).toBe(40);
    });
  });

  describe("Tamper-Seal Signature & Verification Tokens", () => {
    it("generates and verifies valid state integrity signatures", () => {
      const state = {
        playerName: "GDSC Defender",
        completedDays: [1, 2, 3],
        dayScores: { 1: 100, 2: 95, 3: 100 },
      };
      const sig = generateIntegritySignature(state);
      expect(typeof sig).toBe("string");
      expect(sig.length).toBeGreaterThan(6);
      expect(verifyIntegritySignature(state, sig)).toBe(true);
    });

    it("detects tampering when state scores are illegally modified in DevTools", () => {
      const state = {
        playerName: "GDSC Defender",
        completedDays: [1, 2],
        dayScores: { 1: 100, 2: 95 },
      };
      const originalSig = generateIntegritySignature(state);

      // Cheater edits Day 2 score to 99999 in DevTools
      const tamperedState = {
        ...state,
        dayScores: { 1: 100, 2: 99999 },
      };

      expect(verifyIntegritySignature(tamperedState, originalSig)).toBe(false);
    });

    it("detects tampering when days are unlocked out of order", () => {
      const state = {
        playerName: "GDSC Defender",
        completedDays: [1, 2],
        dayScores: { 1: 100, 2: 95 },
      };
      const originalSig = generateIntegritySignature(state);

      // Cheater injects Day 9 completion without solving Day 3-8
      const tamperedState = {
        ...state,
        completedDays: [1, 2, 9],
      };

      expect(verifyIntegritySignature(tamperedState, originalSig)).toBe(false);
    });

    it("generates deterministic verification tokens for festival organizers", () => {
      const token1 = generateVerificationToken("Team Garuda", 900, 420);
      const token2 = generateVerificationToken("Team Garuda", 900, 420);
      expect(token1).toBe(token2);
      expect(token1).toMatch(/^UTSAV-900-T420-[A-F0-9]{4}$/);
    });
  });
});

