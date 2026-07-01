import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AgeVerificationModal from "./components/AgeVerificationModal";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import GeneratePage from "./pages/GeneratePage";
import AnimatePage from "./pages/AnimatePage";
import VideoPage from "./pages/VideoPage";
import SettingsPage from "./pages/SettingsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/generate" component={GeneratePage} />
      <Route path="/animate" component={AnimatePage} />
      <Route path="/video" component={VideoPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already verified their age
    const verified = localStorage.getItem("ageVerified");
    if (verified) {
      try {
        const data = JSON.parse(verified);
        if (data.verified) {
          setAgeVerified(true);
          return;
        }
      } catch {
        // Invalid data, ask again
      }
    }
    setAgeVerified(false);
  }, []);

  const handleAgeVerified = () => {
    setAgeVerified(true);
  };

  // Show loading state while checking localStorage
  if (ageVerified === null) {
    return (
      <div
        style={{
          background: "oklch(0 0 0)",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "oklch(0.98 0 0)", fontSize: "1.2rem" }}>●</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          {/* Age verification modal - shows if not verified */}
          {!ageVerified && (
            <AgeVerificationModal onVerified={handleAgeVerified} />
          )}

          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "oklch(0.08 0 0)",
                border: "1px solid oklch(0.2 0 0)",
                color: "oklch(0.98 0 0)",
                fontFamily: "Inter, sans-serif",
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
