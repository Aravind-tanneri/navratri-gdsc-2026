import React, { useState } from "react";
import { useGame } from "../context/GameContext";

const EMAILS = [
  {
    id: 1,
    isPhishing: false,
    senderName: "GDSC Faculty Advisor",
    senderEmail: "advisor@campus-gdsc.edu",
    subject: "Official Schedule: Navratri Hackathon & Cultural Showcase",
    time: "09:15 AM",
    body: "Hello GDSC Core Team and Volunteers,\n\nPlease find the verified stage schedule and speaker bios for today's Navratri celebration. Registration is open to all registered students at https://campus-gdsc.edu/events/utsav-2026.\n\nWarm regards,\nProf. Sharma",
    attachment: null,
    redFlags: [],
  },
  {
    id: 2,
    isPhishing: true,
    senderName: "Utsav Security Desk",
    senderEmail: "admin@utsav-urgent-verify.xyz",
    subject: "⚠️ IMMEDIATE ACTION: VIP Stage Pass will be DELETED in 2 Hours!!",
    time: "10:02 AM",
    body: "VALUED ATTENDEE,\n\nYour festival passes will be revoked immediately unless you click below within 120 minutes to verify your identity. Enter your master university password immediately.\n\nVerify Now: http://pass-auth-token.xyz/login?urgent=true",
    attachment: null,
    redFlags: ["Urgent threatening language", "Unverified .xyz domain", "Asks for master credentials"],
  },
  {
    id: 3,
    isPhishing: true,
    senderName: "Google IT Support",
    senderEmail: "patch-update@g00gle-accounts.net",
    subject: "Mandatory Firmware Hotfix for Stage Soundboard",
    time: "11:20 AM",
    body: "Attention Sound Engineers,\n\nOur telemetry detected vulnerability CVE-2026-UTSAV. You must run the attached patch executable file on the stage laptop immediately.",
    attachment: "stage_audio_patch_v2.exe",
    redFlags: ["Typo domain (g00gle)", "Unsolicited executable attachment (.exe)"],
  },
  {
    id: 4,
    isPhishing: false,
    senderName: "Festival Canteen Committee",
    senderEmail: "prasad-desk@campus-gdsc.edu",
    subject: "Evening Prasad Distribution Timings & Coupons",
    time: "12:05 PM",
    body: "Namaste Everyone,\n\nPrasad tokens for today's Maha Aarti will be distributed at Stall 4 from 6:30 PM. Present your student ID card at the counter.\n\nHappy Navratri!",
    attachment: null,
    redFlags: [],
  },
  {
    id: 5,
    isPhishing: true,
    senderName: "Dandiya Lucky Draw",
    senderEmail: "prizes@utsav-fest-lottery.top",
    subject: "🎁 YOU WON: Special Golden Dandiya Sticks & iPhone 17!",
    time: "01:30 PM",
    body: "CONGRATULATIONS!\n\nYour student ID was chosen in our secret midnight garba raffle. Claim your prize within 10 minutes or it goes to the next student:\n\nClaim Link: bit.ly/free-garba-prize-claim-now",
    attachment: null,
    redFlags: ["Unsolicited prize winner scam", "Shortened suspicious link", "Fake countdown urgency"],
  },
];

export const Day2 = ({ dayData, onSuccess }) => {
  const { recordWrongAttempt } = useGame();
  const [selectedEmailId, setSelectedEmailId] = useState(1);
  const [flaggedIds, setFlaggedIds] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const selectedEmail = EMAILS.find((e) => e.id === selectedEmailId) || EMAILS[0];

  const toggleFlag = (id) => {
    setStatusMessage("");
    setIsError(false);
    setFlaggedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAudit = () => {
    const phishingIds = EMAILS.filter((e) => e.isPhishing).map((e) => e.id); // [2, 3, 5]
    const hasAllPhishing = phishingIds.every((id) => flaggedIds.includes(id));
    const hasNoLegitFlagged = flaggedIds.every((id) => phishingIds.includes(id));

    if (hasAllPhishing && hasNoLegitFlagged) {
      setStatusMessage("Excellent vigilance! All phishing attacks identified with zero false positives.");
      setIsError(false);
      onSuccess();
    } else {
      recordWrongAttempt(2);
      setIsError(true);
      if (!hasAllPhishing && !hasNoLegitFlagged) {
        setStatusMessage("Review carefully: You missed malicious emails and also mistakenly flagged safe communications.");
      } else if (!hasAllPhishing) {
        setStatusMessage(`You flagged ${flaggedIds.length} email(s), but missed some dangerous phishing messages. Look for fake domains (@g00gle, .xyz) and .exe attachments!`);
      } else {
        setStatusMessage("You found all phishing threats, but you also flagged legitimate university emails! Avoid false positives.");
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="glass-card rounded-2xl border border-slate-700/80 overflow-hidden">
        
        {/* Top Inbox Bar */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📿</span>
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                Festival Mail Quarantine Console
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Inspect 5 incoming emails. Flag all suspicious threats!
              </p>
            </div>
          </div>
          <div className="text-xs font-mono px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300">
            {flaggedIds.length} Flagged
          </div>
        </div>

        {/* 2-Column Inbox View */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
          
          {/* Email List Left Column */}
          <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-800/80 bg-black/40 overflow-y-auto max-h-[280px] md:max-h-[420px]">
            {EMAILS.map((email) => {
              const isSelected = email.id === selectedEmailId;
              const isFlagged = flaggedIds.includes(email.id);

              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmailId(email.id)}
                  className={`p-3.5 border-b border-slate-800/60 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-sky-500/15 border-l-4 border-l-sky-400"
                      : "hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {email.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {email.time}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 truncate font-medium">
                    {email.subject}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                      {email.senderEmail}
                    </span>
                    {isFlagged && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold">
                        🚩 Flagged
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Email Detail Right Column */}
          <div className="md:col-span-7 p-4 sm:p-6 bg-slate-950/60 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h5 className="text-sm sm:text-base font-bold text-slate-100">
                    {selectedEmail.subject}
                  </h5>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    From: <span className="text-sky-300">{selectedEmail.senderName}</span> &lt;{selectedEmail.senderEmail}&gt;
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFlag(selectedEmail.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer active:scale-95 ${
                    flaggedIds.includes(selectedEmail.id)
                      ? "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-[0_0_18px_rgba(244,63,94,0.5)] border border-rose-400/50"
                      : "bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-sky-400/60 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                  }`}
                >
                  {flaggedIds.includes(selectedEmail.id) ? "🚩 Flagged as Phishing" : "⚐ Flag as Suspicious"}
                </button>
              </div>

              {/* Email Content Body */}
              <div className="py-4 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                {selectedEmail.body}
              </div>

              {/* Attachment if present */}
              {selectedEmail.attachment && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-center gap-2 text-xs text-rose-300 my-2">
                  <span className="text-lg">📎</span>
                  <div>
                    <span className="font-mono font-bold block">{selectedEmail.attachment}</span>
                    <span className="text-[10px] text-slate-400">Suspicious binary executable detected</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick guidance tip */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Inspect sender domain, urgent threats, and URLs carefully.</span>
              <span className="text-sky-400 font-mono">Message {selectedEmail.id} of 5</span>
            </div>
          </div>
        </div>

        {/* Audit Status & Action */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs">
            {statusMessage && (
              <span className={isError ? "text-rose-400 font-medium" : "text-emerald-400 font-medium"}>
                {isError ? "⚠️ " : "✓ "} {statusMessage}
              </span>
            )}
            {!statusMessage && (
              <span className="text-slate-400">
                Flag all phishing emails and leave legitimate messages untouched.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAudit}
            className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-500 hover:from-sky-300 hover:to-cyan-400 text-slate-950 shadow-[0_0_22px_rgba(56,189,248,0.5)] border border-sky-300/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Submit Threat Assessment →
          </button>
        </div>

      </div>
    </div>
  );
};
