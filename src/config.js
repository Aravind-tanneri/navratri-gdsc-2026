export const CONFIG = {
  EVENT_NAME: import.meta.env?.VITE_EVENT_NAME || "Navratri Navshakti: Restore the Utsav",
  ORGANIZER: import.meta.env?.VITE_ORGANIZER || "GDSC (Google Developer Student Club)",
  ORGANIZER_SHORT: import.meta.env?.VITE_ORGANIZER_SHORT || "GDSC",
  
  // Set to true to unlock all days immediately for testing or live showcase
  UNLOCK_ALL: import.meta.env?.VITE_UNLOCK_ALL === "true" || false,

  // Google Form link for live leaderboard submissions
  GOOGLE_FORM_URL:
    import.meta.env?.VITE_GOOGLE_FORM_URL ||
    "https://forms.gle/M5Y8v2Qju7uBn4WD6",

  // Background Auto-Submission Endpoint (Google Forms formResponse)
  GOOGLE_FORM_RESPONSE_URL:
    import.meta.env?.VITE_GOOGLE_FORM_RESPONSE_URL ||
    "https://docs.google.com/forms/d/e/1FAIpQLSeY2NHiFXAthlmxD9t49kTFktrBL4LPl5BJcqyLlbxKjEi05Q/formResponse",

  // Entry ID mappings extracted directly from the live Google Form
  FORM_ENTRIES: {
    name: import.meta.env?.VITE_FORM_ENTRY_NAME || "entry.1709921399",
    score: import.meta.env?.VITE_FORM_ENTRY_SCORE || "entry.315576857",
    timeSeconds: import.meta.env?.VITE_FORM_ENTRY_TIME || "entry.379942005",
    token: import.meta.env?.VITE_FORM_ENTRY_TOKEN || "entry.596081587",
  },

  // Published Google Sheet / Excel CSV link for global leaderboard sync
  LEADERBOARD_CSV_URL:
    import.meta.env?.VITE_LEADERBOARD_CSV_URL || "/leaderboard.csv",

  // Scoring configuration
  BASE_DAY_SCORE: Number(import.meta.env?.VITE_BASE_DAY_SCORE) || 100,
  HINT_PENALTY: Number(import.meta.env?.VITE_HINT_PENALTY) || 5,
  WRONG_ATTEMPT_PENALTY: Number(import.meta.env?.VITE_WRONG_ATTEMPT_PENALTY) || 5,
  MIN_DAY_SCORE: Number(import.meta.env?.VITE_MIN_DAY_SCORE) || 40,
  TOTAL_DAYS: 9,
};
