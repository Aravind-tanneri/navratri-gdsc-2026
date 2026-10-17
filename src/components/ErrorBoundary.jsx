import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unexpected exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetState = () => {
    try {
      localStorage.removeItem("gdsc_navshakti_state_2026");
      localStorage.removeItem("gdac_navshakti_state_2026");
      window.location.href = "/";
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0314] text-slate-100 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.3)] text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-3xl">
              🛡️
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">
                [ Runtime Shield Activated ]
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-100">
                Defensive Boundary Intercept
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              An unexpected script exception was neutralized before it could compromise application state. Your data is protected by the GDSC security barrier.
            </p>

            {this.state.error && (
              <div className="p-3 bg-black/60 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-24">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md cursor-pointer"
              >
                Reload Application
              </button>
              <button
                type="button"
                onClick={this.handleResetState}
                className="px-5 py-2.5 rounded-xl text-xs font-medium bg-rose-950/50 hover:bg-rose-900/50 text-rose-200 border border-rose-500/40 cursor-pointer"
              >
                Purge Corrupted State & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
