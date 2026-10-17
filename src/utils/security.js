// Security & Rate Limiting Utility for Navshakti

/**
 * Sanitizes user input string against XSS, script injection, and payload overflow
 * @param {string} input - Raw user input
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Clean, sanitized string
 */
export const sanitizeInput = (input, maxLength = 100) => {
  if (typeof input === "number") input = String(input);
  else if (typeof input !== "string") return "";
  
  // Truncate to prevent memory/ReDoS attacks
  const truncated = input.slice(0, maxLength);

  // Strip script blocks and all HTML tags
  const cleaned = truncated
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove full script blocks
    .replace(/<[^>]*>?/gm, "") // Strip remaining HTML tags
    .replace(/javascript:/gi, "") // Remove javascript pseudo-protocol
    .replace(/on\w+\s*=/gi, "") // Remove onerror=, onclick=, etc.
    .replace(/[<>"'&]/g, (char) => {
      switch (char) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#x27;";
        case "&": return "&amp;";
        default: return char;
      }
    });

  return cleaned.trim();
};

/**
 * Safe JSON parse with prototype pollution prevention
 * @param {string} jsonString - String to parse
 * @param {any} fallback - Fallback if parse fails or is invalid
 */
export const safeParseJSON = (jsonString, fallback) => {
  if (!jsonString || typeof jsonString !== "string") return fallback;
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") return fallback;

    // Prevent Prototype Pollution
    if ("__proto__" in parsed || "constructor" in parsed || "prototype" in parsed) {
      delete parsed.__proto__;
      delete parsed.constructor;
      delete parsed.prototype;
    }

    return parsed;
  } catch (err) {
    console.warn("Corrupted JSON state caught safely by security barrier", err);
    return fallback;
  }
};

/**
 * In-memory sliding-window rate limiter
 * Protects against automated script loops, brute-force spamming, and console flooding
 */
class SlidingWindowRateLimiter {
  constructor() {
    this.actionHistory = new Map();
  }

  /**
   * Check if an action is allowed within the rate limit window
   * @param {string} actionKey - Unique identifier for the action (e.g. 'day1_attempt', 'day5_guess')
   * @param {number} maxAttempts - Maximum attempts allowed in window (default 4)
   * @param {number} windowSeconds - Duration of window in seconds (default 8)
   * @returns {{ allowed: boolean, remainingAttempts: number, retryAfterSeconds: number }}
   */
  checkLimit(actionKey, maxAttempts = 4, windowSeconds = 8) {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    let timestamps = this.actionHistory.get(actionKey) || [];
    
    // Purge records older than the active window
    timestamps = timestamps.filter((t) => now - t < windowMs);

    if (timestamps.length >= maxAttempts) {
      const oldestInWindow = timestamps[0];
      const waitTimeMs = windowMs - (now - oldestInWindow);
      const retryAfterSeconds = Math.max(1, Math.ceil(waitTimeMs / 1000));

      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSeconds,
      };
    }

    // Record this attempt
    timestamps.push(now);
    this.actionHistory.set(actionKey, timestamps);

    return {
      allowed: true,
      remainingAttempts: maxAttempts - timestamps.length,
      retryAfterSeconds: 0,
    };
  }

  /**
   * Clear rate limit history for a specific action key
   */
  resetLimit(actionKey) {
    this.actionHistory.delete(actionKey);
  }
}

export const rateLimiter = new SlidingWindowRateLimiter();

// -------------------------------------------------------------
// Tamper-Seal & Cryptographic Checksum System
// -------------------------------------------------------------

const INTEGRITY_SALT = "GDSC_NAVRATRI_UTSAV_SHAKTI_SALT_2026_#9DEV1";

/**
 * Deterministic 64-bit multi-round FNV-1a & Murmur-inspired fast hash
 * @param {string} str - Raw string payload
 * @returns {string} - Hexadecimal hash string
 */
export const hashPayload = (str) => {
  if (typeof str !== "string") str = String(str || "");
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
};

/**
 * Generates tamper-seal signature for game state based on canonical critical fields
 * @param {object} state - Game state object
 * @returns {string} - Tamper-seal signature
 */
export const generateIntegritySignature = (state) => {
  if (!state || typeof state !== "object") return "";
  const nameStr = typeof state.playerName === "string" ? state.playerName.trim() : "";
  const completedStr = Array.isArray(state.completedDays) ? [...state.completedDays].sort((a, b) => a - b).join(",") : "";
  const scoresStr = state.dayScores && typeof state.dayScores === "object"
    ? Object.keys(state.dayScores).sort().map((k) => `${k}:${state.dayScores[k]}`).join(";")
    : "";
  const rawKey = `${INTEGRITY_SALT}|${nameStr}|${completedStr}|${scoresStr}|${INTEGRITY_SALT}`;
  return hashPayload(rawKey);
};

/**
 * Validates integrity signature against provided state
 * @param {object} state - Game state object
 * @param {string} signature - Stored signature
 * @returns {boolean} - True if signature is intact and valid
 */
export const verifyIntegritySignature = (state, signature) => {
  if (!signature || typeof signature !== "string") return false;
  const expected = generateIntegritySignature(state);
  return expected === signature;
};

/**
 * Generates an official short completion verification code for festival organizers
 * e.g. UTSAV-860-T450-7F2A
 */
export const generateVerificationToken = (playerName, totalScore, totalTimeSeconds) => {
  const cleanName = sanitizeInput(playerName || "VALIANT", 20).toUpperCase();
  const raw = `${cleanName}-${totalScore}-${totalTimeSeconds}-${INTEGRITY_SALT}`;
  const code = hashPayload(raw).slice(0, 4).toUpperCase();
  return `UTSAV-${totalScore}-T${totalTimeSeconds}-${code}`;
};
