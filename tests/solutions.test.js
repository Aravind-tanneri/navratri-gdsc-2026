import { describe, it, expect } from "vitest";
import { DAYS_DATA } from "../src/data/days";

describe("Navratri Navshakti: Solutions Verification Test Suite", () => {
  // Day 1: SDLC Pipeline Challenge
  describe("Day 1: The Foundation Challenge (Maa Shailputri)", () => {
    const CORRECT_ORDER = [
      "Plan requirements",
      "Design architecture",
      "Set up repo and version control",
      "Build features",
      "Add authentication and secure secrets",
      "Test",
      "Deploy and monitor",
    ];

    it("accepts the official 7-step SDLC order from solutions.md", () => {
      const submittedOrder = [
        "Plan requirements",
        "Design architecture",
        "Set up repo and version control",
        "Build features",
        "Add authentication and secure secrets",
        "Test",
        "Deploy and monitor",
      ];

      const isCorrect = submittedOrder.every((item, idx) => item === CORRECT_ORDER[idx]);
      expect(isCorrect).toBe(true);
    });

    it("rejects an inverted or scrambled SDLC order", () => {
      const scrambledOrder = [
        "Deploy and monitor",
        "Plan requirements",
        "Build features",
        "Test",
        "Set up repo and version control",
        "Design architecture",
        "Add authentication and secure secrets",
      ];

      const isCorrect = scrambledOrder.every((item, idx) => item === CORRECT_ORDER[idx]);
      expect(isCorrect).toBe(false);
    });

    it("verifies clue token produced for Day 1", () => {
      const day1 = DAYS_DATA.find((d) => d.day === 1);
      expect(day1.clueLabel).toBe("ENTRY POINT");
      expect(day1.clueValue).toBe("Admin Portal");
    });
  });

  // Day 2: Phishing & Social Engineering
  describe("Day 2: The Patience Test (Maa Brahmacharini)", () => {
    const EMAILS = [
      { id: 1, isPhishing: false, senderEmail: "advisor@campus-gdsc.edu" },
      { id: 2, isPhishing: true, senderEmail: "admin@utsav-urgent-verify.xyz" },
      { id: 3, isPhishing: true, senderEmail: "patch-update@g00gle-accounts.net" },
      { id: 4, isPhishing: false, senderEmail: "prasad-desk@campus-gdsc.edu" },
      { id: 5, isPhishing: true, senderEmail: "prizes@utsav-fest-lottery.top" },
    ];

    const auditEmails = (flaggedIds) => {
      const phishingIds = EMAILS.filter((e) => e.isPhishing).map((e) => e.id); // [2, 3, 5]
      const hasAllPhishing = phishingIds.every((id) => flaggedIds.includes(id));
      const hasNoLegitFlagged = flaggedIds.every((id) => phishingIds.includes(id));
      return hasAllPhishing && hasNoLegitFlagged;
    };

    it("accepts flagging exactly emails 2, 3, and 5", () => {
      const officialSolutionFlags = [2, 3, 5];
      expect(auditEmails(officialSolutionFlags)).toBe(true);
    });

    it("rejects if a legitimate email is falsely flagged", () => {
      const flagsWithFalsePositive = [1, 2, 3, 5];
      expect(auditEmails(flagsWithFalsePositive)).toBe(false);
    });

    it("rejects if any phishing attack is missed", () => {
      const incompleteFlags = [2, 3]; // missed #5
      expect(auditEmails(incompleteFlags)).toBe(false);
    });

    it("verifies clue token produced for Day 2", () => {
      const day2 = DAYS_DATA.find((d) => d.day === 2);
      expect(day2.clueLabel).toBe("BREACH METHOD");
      expect(day2.clueValue).toBe("Phishing email");
    });
  });

  // Day 3: Alert & Incident Response
  describe("Day 3: The Alert Challenge (Maa Chandraghanta)", () => {
    const ROUND_SOLUTIONS = {
      round1: "b", // Dismiss popup, verify via official bookmarked portal
      round2: "b", // Ignore SMS, rotate passwords directly on official server
      round3: "c", // Isolate USB in anti-static bag, deliver to SOC sandbox
    };

    it("accepts the verified protocol decisions for all 3 rounds", () => {
      const playerChoices = { round1: "b", round2: "b", round3: "c" };
      expect(playerChoices.round1).toBe(ROUND_SOLUTIONS.round1);
      expect(playerChoices.round2).toBe(ROUND_SOLUTIONS.round2);
      expect(playerChoices.round3).toBe(ROUND_SOLUTIONS.round3);
    });

    it("rejects panic actions such as clicking urgent popup overrides or disclosing SMS OTPs", () => {
      const panicChoiceRound1 = "a"; // click override
      const panicChoiceRound2 = "a"; // send OTP
      expect(panicChoiceRound1).not.toBe(ROUND_SOLUTIONS.round1);
      expect(panicChoiceRound2).not.toBe(ROUND_SOLUTIONS.round2);
    });

    it("verifies clue token produced for Day 3", () => {
      const day3 = DAYS_DATA.find((d) => d.day === 3);
      expect(day3.clueLabel).toBe("NEXT MOVE");
      expect(day3.clueValue).toBe("Privilege escalation");
    });
  });

  // Day 4: AI & Hallucination Filtering
  describe("Day 4: The AI Challenge (Maa Kushmanda)", () => {
    const MOCK_AI_STATEMENTS = [
      { id: "s1", isHallucination: false },
      { id: "s2", isHallucination: true }, // RSA-4096 cracked in 0.2ms via quantum entanglement
      { id: "s3", isHallucination: false },
      { id: "s4", isHallucination: true }, // Telemetry stored in copper pendulum clocks
      { id: "s5", isHallucination: false },
    ];

    const verifyTappedStatements = (tappedIds) => {
      const hallucinationIds = MOCK_AI_STATEMENTS.filter((s) => s.isHallucination).map((s) => s.id);
      const caughtAll = hallucinationIds.every((id) => tappedIds.includes(id));
      const noFalsePositives = tappedIds.every((id) => hallucinationIds.includes(id));
      return caughtAll && noFalsePositives;
    };

    it("accepts tapping exactly statements s2 and s4", () => {
      const solution = ["s2", "s4"];
      expect(verifyTappedStatements(solution)).toBe(true);
    });

    it("rejects tapping legitimate technical facts as hallucinations", () => {
      const wrong = ["s1", "s2", "s4"];
      expect(verifyTappedStatements(wrong)).toBe(false);
    });

    it("verifies clue token produced for Day 4", () => {
      const day4 = DAYS_DATA.find((d) => d.day === 4);
      expect(day4.clueLabel).toBe("HIDDEN MESSAGE");
      expect(day4.clueValue).toBe("Trust no unsigned update");
    });
  });

  // Day 5: Multi-Role Key Sharding
  describe("Day 5: The Collaboration Challenge (Maa Skandamata)", () => {
    const validatePasskey = (input) => {
      const normalized = input.trim().toUpperCase().replace(/\s+/g, "_");
      return normalized === "DANDIYA_BOOKING_DATABASE" || normalized === "DANDIYA BOOKING DATABASE";
    };

    it("accepts master key with underscores or spaces, case-insensitively", () => {
      expect(validatePasskey("DANDIYA_BOOKING_DATABASE")).toBe(true);
      expect(validatePasskey("dandiya_booking_database")).toBe(true);
      expect(validatePasskey("DANDIYA BOOKING DATABASE")).toBe(true);
      expect(validatePasskey("  Dandiya_Booking_Database  ")).toBe(true);
    });

    it("rejects incomplete or incorrect key combinations", () => {
      expect(validatePasskey("DANDIYA_DATABASE")).toBe(false);
      expect(validatePasskey("BOOKING_DATABASE")).toBe(false);
      expect(validatePasskey("RANDOM_KEY")).toBe(false);
    });

    it("verifies clue token produced for Day 5", () => {
      const day5 = DAYS_DATA.find((d) => d.day === 5);
      expect(day5.clueLabel).toBe("COMPROMISED PART");
      expect(day5.clueValue).toBe("Dandiya Booking Database");
    });
  });

  // Day 6: Secure Coding & Loop Boundary Fix
  describe("Day 6: The Debugging Battle (Maa Katyayani)", () => {
    const SQL_FIX_OPTIONS = [
      { id: "raw", isCorrect: false },
      { id: "param", isCorrect: true }, // Parameterized Query
      { id: "upper", isCorrect: false },
    ];

    const LOOP_FIX_OPTIONS = [
      { id: "lte", isCorrect: false },
      { id: "lt", isCorrect: true }, // i < attendees.length
      { id: "plus", isCorrect: false },
    ];

    const validatePatches = (sqlId, loopId) => {
      const isSqlGood = SQL_FIX_OPTIONS.find((o) => o.id === sqlId)?.isCorrect;
      const isLoopGood = LOOP_FIX_OPTIONS.find((o) => o.id === loopId)?.isCorrect;
      return Boolean(isSqlGood && isLoopGood);
    };

    it("accepts Parameterized Query (param) and Strict Boundary (lt)", () => {
      expect(validatePatches("param", "lt")).toBe(true);
    });

    it("rejects string concatenation and off-by-one loops", () => {
      expect(validatePatches("raw", "lt")).toBe(false);
      expect(validatePatches("param", "lte")).toBe(false);
      expect(validatePatches("upper", "plus")).toBe(false);
    });

    it("verifies clue token produced for Day 6", () => {
      const day6 = DAYS_DATA.find((d) => d.day === 6);
      expect(day6.clueLabel).toBe("VULNERABILITY");
      expect(day6.clueValue).toBe("SQL Injection");
    });
  });

  // Day 7: Log Forensics & Threat Attribution
  describe("Day 7: The Dark Clue (Maa Kalaratri)", () => {
    const MALICIOUS_LOG_IDS = [114, 117, 120];

    const validateLogSelections = (selectedIds) => {
      const selectedMalicious = selectedIds.filter((id) => MALICIOUS_LOG_IDS.includes(id));
      const selectedBenign = selectedIds.filter((id) => !MALICIOUS_LOG_IDS.includes(id));
      return selectedMalicious.length === 3 && selectedBenign.length === 0;
    };

    it("accepts selecting the 3 malicious attacker logs (114, 117, 120)", () => {
      expect(validateLogSelections([114, 117, 120])).toBe(true);
    });

    it("rejects false positives (benign maintenance logs)", () => {
      expect(validateLogSelections([114, 117, 120, 101])).toBe(false);
    });

    it("rejects incomplete selections", () => {
      expect(validateLogSelections([114, 117])).toBe(false);
    });

    it("verifies clue token produced for Day 7", () => {
      const day7 = DAYS_DATA.find((d) => d.day === 7);
      expect(day7.clueLabel).toBe("SUSPECTED ATTACKER");
      expect(day7.clueValue).toBe("mahishasur_bot");
    });
  });

  // Day 8: Fact-Checking & Media Literacy
  describe("Day 8: The Truth Challenge (Maa Mahagauri)", () => {
    const CLAIMS = [
      { id: 1, correctState: "False" },
      { id: 2, correctState: "Verified" },
      { id: 3, correctState: "Unverified" },
      { id: 4, correctState: "Verified" },
      { id: 5, correctState: "False" },
    ];

    const evaluateClaims = (userAssessments) => {
      let score = 0;
      CLAIMS.forEach((c) => {
        if (userAssessments[c.id] === c.correctState) {
          score++;
        }
      });
      return score >= 4;
    };

    it("accepts 5 out of 5 correct truth classifications from solutions.md", () => {
      const officialAnswers = {
        1: "False",
        2: "Verified",
        3: "Unverified",
        4: "Verified",
        5: "False",
      };
      expect(evaluateClaims(officialAnswers)).toBe(true);
    });

    it("accepts a passing score of 4 out of 5", () => {
      const fourOfFive = {
        1: "False",
        2: "Verified",
        3: "Unverified",
        4: "Verified",
        5: "Unverified", // 1 mistake
      };
      expect(evaluateClaims(fourOfFive)).toBe(true);
    });

    it("rejects fewer than 4 correct classifications", () => {
      const failingAnswers = {
        1: "Verified",
        2: "False",
        3: "Verified",
        4: "False",
        5: "Verified",
      };
      expect(evaluateClaims(failingAnswers)).toBe(false);
    });

    it("verifies clue token produced for Day 8", () => {
      const day8 = DAYS_DATA.find((d) => d.day === 8);
      expect(day8.clueLabel).toBe("MOTIVE");
      expect(day8.clueValue).toBe("Data theft for resale");
    });
  });

  // Day 9: Master Synthesis & Restoration
  describe("Day 9: The Final Unlock (Maa Siddhidatri)", () => {
    const PARAMETERS = [
      { key: "entryPoint", correct: "Admin Portal" },
      { key: "breachMethod", correct: "Phishing email" },
      { key: "nextMove", correct: "Privilege escalation" },
      { key: "hiddenMessage", correct: "Trust no unsigned update" },
      { key: "compromisedPart", correct: "Dandiya Booking Database" },
      { key: "vulnerability", correct: "SQL Injection" },
      { key: "attacker", correct: "mahishasur_bot" },
      { key: "motive", correct: "Data theft for resale" },
    ];

    const verifyRestorationMatrix = (selections) => {
      return PARAMETERS.every((p) => selections[p.key] === p.correct);
    };

    it("accepts all 8 correlated forensic parameters from solutions.md", () => {
      const officialSolutions = {
        entryPoint: "Admin Portal",
        breachMethod: "Phishing email",
        nextMove: "Privilege escalation",
        hiddenMessage: "Trust no unsigned update",
        compromisedPart: "Dandiya Booking Database",
        vulnerability: "SQL Injection",
        attacker: "mahishasur_bot",
        motive: "Data theft for resale",
      };

      expect(verifyRestorationMatrix(officialSolutions)).toBe(true);
    });

    it("rejects reboot if any forensic parameter is incorrect", () => {
      const flawedSelections = {
        entryPoint: "Public WiFi", // Wrong
        breachMethod: "Phishing email",
        nextMove: "Privilege escalation",
        hiddenMessage: "Trust no unsigned update",
        compromisedPart: "Dandiya Booking Database",
        vulnerability: "SQL Injection",
        attacker: "mahishasur_bot",
        motive: "Data theft for resale",
      };

      expect(verifyRestorationMatrix(flawedSelections)).toBe(false);
    });

    it("verifies all 9 days exist in DAYS_DATA", () => {
      expect(DAYS_DATA).toHaveLength(9);
      for (let day = 1; day <= 9; day++) {
        const found = DAYS_DATA.find((d) => d.day === day);
        expect(found).toBeDefined();
        expect(found.clueValue).toBeTruthy();
      }
    });
  });
});
