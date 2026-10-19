// Background Automated Google Form Submission Utility
import { CONFIG } from "../config";

const SUBMITTED_STORAGE_KEY = "gdsc_submitted_token_2026";

/**
 * Checks whether this specific token has already been submitted
 * @param {string} token
 * @returns {boolean}
 */
export function isScoreAlreadySubmitted(token) {
  if (!token) return false;
  try {
    return localStorage.getItem(SUBMITTED_STORAGE_KEY) === token;
  } catch {
    return false;
  }
}

/**
 * Automatically submits participant scores directly to the linked Google Form in the background.
 * Uses mode: 'no-cors' so the browser delivers the payload to Google without CORS restrictions.
 * Prevents redundant duplicate submissions for the same token unless force=true.
 *
 * @param {Object} params
 * @param {string} params.name - Player / Team Call-Sign
 * @param {string} [params.email] - Participant Email
 * @param {string} [params.rollNumber] - Participant Roll Number
 * @param {number} params.score - Total Score (out of 900)
 * @param {number} params.timeSeconds - Active Quest Elapsed Seconds
 * @param {string} params.token - Cryptographic Verification Token
 * @param {boolean} [params.force=false] - Force re-submission even if token was already submitted
 * @returns {Promise<{ success: boolean, alreadySubmitted?: boolean, message: string }>}
 */
export async function autoSubmitScoreToGoogleForm({ name, email = "", rollNumber = "", score, timeSeconds, token, force = false }) {
  if (!CONFIG.GOOGLE_FORM_RESPONSE_URL) {
    return { success: false, message: "Form submission endpoint not configured." };
  }

  // Prevent redundant submissions if this exact token is already recorded
  if (!force && isScoreAlreadySubmitted(token)) {
    return {
      success: true,
      alreadySubmitted: true,
      message: "Score is already recorded in the live GDSC standings!",
    };
  }

  try {
    const formData = new URLSearchParams();
    const entries = CONFIG.FORM_ENTRIES || {};

    formData.append(entries.name || "entry.1709921399", name || "Anonymous Defender");
    formData.append(entries.email || "entry.2140006638", email || "");
    formData.append(entries.rollNumber || "entry.5928566", rollNumber || "");
    formData.append(entries.score || "entry.315576857", String(score ?? 0));
    formData.append(entries.timeSeconds || "entry.379942005", String(timeSeconds ?? 0));
    formData.append(entries.token || "entry.596081587", token || "");

    // Background POST directly to Google Forms formResponse
    await fetch(CONFIG.GOOGLE_FORM_RESPONSE_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    // Mark as submitted locally so repeated clicks/re-renders don't spam Google
    if (token) {
      try {
        localStorage.setItem(SUBMITTED_STORAGE_KEY, token);
      } catch (e) {
        console.warn("Could not save submitted token locally", e);
      }
    }

    return {
      success: true,
      message: "Score successfully submitted to the GDSC Live Leaderboard!",
    };
  } catch (err) {
    console.warn("Auto-submission warning:", err);
    return {
      success: false,
      message: "Could not auto-submit to Google Form. Please use manual link.",
    };
  }
}
