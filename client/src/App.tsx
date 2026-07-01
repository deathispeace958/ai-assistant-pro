import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
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
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
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
