# 🪔 Navratri Navshakti: Restore the Utsav
**Presented by GDSC (Google Developer Student Club)**

An interactive, narrative-driven DevSecOps and AI literacy quest uniting traditional Indian cultural celebration with cutting-edge engineering principles.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🛠️ Technology Stack
- **Framework**: React 19 (JavaScript) + Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **Routing**: React Router (`react-router-dom`)
- **Animation**: Framer Motion & CSS keyframe animations
- **Celebration Effects**: `canvas-confetti`
- **Audio**: Web Audio API synthesis (Sound-free by default; toggle for festive temple bell and dhol taps)
- **State & Storage**: 100% Client-Side `localStorage` persistence (no backend required)

---

## ⚙️ Environment Configuration (`.env`)

You can configure your custom Google Form submission link and event properties using `.env` without touching any code:

```bash
# Copy template to create your local .env
cp .env.example .env
```

Inside `.env`:
```env
# Official Google Form URL for live leaderboard submissions
VITE_GOOGLE_FORM_URL="https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_ID/viewform"

# Organizer demo toggle: set to "true" to immediately unlock all 9 days for showcases
VITE_UNLOCK_ALL=false

# Optional Organization & Event Overrides
VITE_EVENT_NAME="Navratri Navshakti: Restore the Utsav"
VITE_ORGANIZER="GDSC (Google Developer Student Club)"

# Scoring parameters
VITE_BASE_DAY_SCORE=100
VITE_HINT_PENALTY=5
VITE_WRONG_ATTEMPT_PENALTY=5
VITE_MIN_DAY_SCORE=40
```

All values in [src/config.js](file:///d:/web%20development/navratri2026/src/config.js) automatically read from these environment variables with safe defaults.

---

## 📊 Live Global Leaderboard Sync (Google Sheets / Excel)

You can turn any Google Sheet into an auto-updating global leaderboard without needing a backend or database:

1. Link your **Google Form** to a **Google Sheet** (standard Google Forms feature).
2. Inside Google Sheets, click:
   - **File** → **Share** → **Publish to web**
   - Under Link, select **Entire Document** (or sheet name), and change "Web page" to **Comma-separated values (.csv)**
   - Click **Publish** and copy the generated link.
3. Paste the URL into your [.env](file:///d:/web%20development/navratri2026/.env) file:
   ```env
   VITE_LEADERBOARD_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-YOUR_SHEET_ID/pub?output=csv"
   ```
4. Now, whenever players or organizers click **"🔄 Sync Live Standings"** on the Leaderboard page:
   - The app fetches and parses the latest sheet submissions.
   - Automatically ranks all campus teams by **Score (descending)** and **Time (ascending)**.
   - Highlights the current user's team in the global ranking.
   - Anyone can click **"📥 Export to Excel / CSV"** to download the offline standings spreadsheet!

---

## 📝 Editing Challenge Data (`src/data/days.js`)

All 9 days' narrative, questions, clues, lessons, and color tokens live in `src/data/days.js`.
To customize clue targets or change story text:
1. Open `src/data/days.js`.
2. Locate the specific Day object (e.g. Day 1 Maa Shailputri, Day 2 Maa Brahmacharini).
3. Edit `story`, `hint`, `clueLabel`, `clueValue`, or `lessonBody`.
4. Clues automatically sync across the challenge view, Clue Book, and Day 9 restoration matrix.

---

## 🎨 Theme Tokens & Styling (`src/index.css`)

Tailwind CSS v4 tokens are defined using `@theme` in `src/index.css`:
- **Colors**: `--color-maroon`, `--color-indigo-nav`, `--color-gold`, `--color-saffron`, `--color-magenta`, `--color-teal`, and 9 per-Devi tokens (`--color-devi-shailputri`, etc.).
- **Fonts**: `--font-heading` (*Cinzel Decorative* / *Tiro Devanagari Hindi*), `--font-body` (*Poppins*), `--font-mono` (*JetBrains Mono*).
- **Animations**: `animate-glitch`, `animate-diya`, `animate-petal`, `animate-shake`, `animate-glow`, `animate-float`.
- **Reusable Utilities**: `@utility glass-card`, `@utility neon-gold-border`, `@utility terminal-panel`.

---

## 🌐 Deployment Instructions

### 1. Vercel
```bash
npm install -g vercel
vercel
```
Or connect your GitHub repository to Vercel and set:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2. Netlify
Create a `_redirects` file in `public/_redirects`:
```
/*    /index.html   200
```
Deploy via the Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 3. Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to: dist
# Configure as single-page app: Yes
firebase deploy
```

---

## 📜 Nine Divine Powers & Forensic Clues
1. **Day 1 (Maa Shailputri)**: Foundation SDLC Order ➔ `ENTRY POINT = "Admin Portal"`
2. **Day 2 (Maa Brahmacharini)**: Phishing Inbox Vigilance ➔ `BREACH METHOD = "Phishing email"`
3. **Day 3 (Maa Chandraghanta)**: Incident Response & MFA ➔ `NEXT MOVE = "Privilege escalation"`
4. **Day 4 (Maa Kushmanda)**: Prompting & AI Hallucinations ➔ `HIDDEN MESSAGE = "Trust no unsigned update"`
5. **Day 5 (Maa Skandamata)**: Cross-Role Key Assembly ➔ `COMPROMISED PART = "Dandiya Booking Database"`
6. **Day 6 (Maa Katyayani)**: SQL Injection & Loop Debugging ➔ `VULNERABILITY = "SQL Injection"`
7. **Day 7 (Maa Kalaratri)**: SIEM Forensic Log Correlation ➔ `SUSPECTED ATTACKER = "mahishasur_bot"`
8. **Day 8 (Maa Mahagauri)**: Fact-Checking & Responsible AI ➔ `MOTIVE = "Data theft for resale"`
9. **Day 9 (Maa Siddhidatri)**: Grand Synthesis & Firewall Reboot ➔ `RESTORED SYSTEM = 100% Integrity`

---
*Jai Mata Di • Presented with ❤️ by GDSC (Google Developer Student Club)*
