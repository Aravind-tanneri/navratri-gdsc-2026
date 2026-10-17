import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { PetalsBackground } from "./components/PetalsBackground";
import { TeamNameModal } from "./components/TeamNameModal";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useGame } from "./context/GameContext";

// Pages
import { Home } from "./pages/Home";
import { Day } from "./pages/Day";
import { ScorecardPage } from "./pages/ScorecardPage";
import { Final } from "./pages/Final";
import { Leaderboard } from "./pages/Leaderboard";
import { About } from "./pages/About";
import { Toaster } from "react-hot-toast";

export const App = () => {
  const { playerName } = useGame();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Automatically prompt for team/player call-sign on first visit if not yet set
  useEffect(() => {
    if (!playerName) {
      const timer = setTimeout(() => {
        setIsNameModalOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [playerName]);

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans">
        {/* Background Animated Marigold Petals */}
        <PetalsBackground />

        {/* Sticky Festive Navigation */}
        <Navbar onOpenNameModal={() => setIsNameModalOpen(true)} />

        {/* Main Content View with Error Boundary Isolation */}
        <main className="relative z-10 flex-1">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/day/:n" element={<Day />} />
              <Route path="/scorecard" element={<ScorecardPage />} />
              <Route path="/final" element={<Final />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Festive GDSC Footer */}
        <Footer />

        {/* Team / Defender Name Modal */}
        <TeamNameModal
          isOpen={isNameModalOpen}
          onClose={() => setIsNameModalOpen(false)}
        />

        {/* Global Festive Toast Notification Container */}
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 3500,
            style: {
              background: "#130422",
              color: "#f8fafc",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              boxShadow: "0 12px 35px -5px rgba(0, 0, 0, 0.85), 0 0 20px rgba(245, 158, 11, 0.25)",
              borderRadius: "16px",
              fontSize: "13px",
              fontWeight: 500,
              padding: "12px 18px",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#042f2e",
              },
              style: {
                border: "1px solid rgba(16, 185, 129, 0.5)",
                boxShadow: "0 12px 35px -5px rgba(0, 0, 0, 0.85), 0 0 20px rgba(16, 185, 129, 0.25)",
              },
            },
            error: {
              iconTheme: {
                primary: "#f43f5e",
                secondary: "#4c0519",
              },
              style: {
                border: "1px solid rgba(244, 63, 94, 0.5)",
                boxShadow: "0 12px 35px -5px rgba(0, 0, 0, 0.85), 0 0 20px rgba(244, 63, 94, 0.25)",
              },
            },
            loading: {
              iconTheme: {
                primary: "#f59e0b",
                secondary: "#451a03",
              },
              style: {
                border: "1px solid rgba(245, 158, 11, 0.5)",
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
