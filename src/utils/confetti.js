import confetti from "canvas-confetti";

/**
 * Triggers a dual-cannon festive party popper celebration with multi-colored confetti
 * @param {string} [themeColor] - Optional accent color to prioritize
 */
export const triggerPartyPopper = (themeColor = "#f59e0b") => {
  try {
    // 1. Center burst
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.65 },
      colors: [themeColor, "#f59e0b", "#f97316", "#10b981", "#ec4899", "#8b5cf6", "#38bdf8", "#ffd700"],
      startVelocity: 35,
      scalar: 1.15,
      ticks: 250,
      zIndex: 9999,
    });

    // 2. Left party popper cannon shot upwards and inwards
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.75 },
        colors: [themeColor, "#f43f5e", "#10b981", "#38bdf8", "#fbbf24"],
        startVelocity: 45,
        scalar: 1.1,
        zIndex: 9999,
      });
    }, 120);

    // 3. Right party popper cannon shot upwards and inwards
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.75 },
        colors: [themeColor, "#ec4899", "#8b5cf6", "#38bdf8", "#fbbf24"],
        startVelocity: 45,
        scalar: 1.1,
        zIndex: 9999,
      });
    }, 240);

    // 4. Subtle golden star rain
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 100,
        origin: { y: 0.4 },
        shapes: ["circle"],
        colors: ["#ffd700", "#fef08a", "#f59e0b"],
        scalar: 0.8,
        gravity: 0.8,
        drift: 0,
        zIndex: 9999,
      });
    }, 400);
  } catch (e) {
    console.warn("Canvas confetti trigger skipped or unsupported:", e);
  }
};
