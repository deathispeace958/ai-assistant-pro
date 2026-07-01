import { Link, useLocation } from "wouter";
import { useState } from "react";

const NAV_ITEMS = [
  { path: "/chat", label: "CHAT" },
  { path: "/generate", label: "GENERATE" },
  { path: "/animate", label: "ANIMATE" },
  { path: "/video", label: "VIDEO" },
  { path: "/settings", label: "SETTINGS" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "oklch(0.04 0 0)",
        color: "oklch(0.98 0 0)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: "oklch(0.04 0 0)",
          borderBottom: "1px solid oklch(0.12 0 0)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          {/* Logo */}
          <Link href="/">
            <span
              style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "1.8rem",
                letterSpacing: "0.1em",
                color: "oklch(0.98 0 0)",
                textDecoration: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: "oklch(0.55 0.22 27)" }}>AI</span>
              <span>ASSISTANT PRO</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            style={{
              display: "flex",
              gap: "0.25rem",
              alignItems: "center",
            }}
            className="hidden-mobile"
          >
            {NAV_ITEMS.map((item) => {
              const active =
                location === item.path ||
                (item.path !== "/" && location.startsWith(item.path));
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: "1rem",
                      letterSpacing: "0.12em",
                      padding: "0.4rem 0.9rem",
                      cursor: "pointer",
                      color: active ? "oklch(0.04 0 0)" : "oklch(0.98 0 0)",
                      background: active
                        ? "oklch(0.55 0.22 27)"
                        : "transparent",
                      border: `2px solid ${active ? "oklch(0.55 0.22 27)" : "oklch(0.25 0 0)"}`,
                      transition: "all 0.12s ease-out",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.target as HTMLElement).style.background =
                          "oklch(0.14 0 0)";
                        (e.target as HTMLElement).style.borderColor =
                          "oklch(0.98 0 0)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.target as HTMLElement).style.background =
                          "transparent";
                        (e.target as HTMLElement).style.borderColor =
                          "oklch(0.25 0 0)";
                      }
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              background: "none",
              border: "2px solid oklch(0.98 0 0)",
              color: "oklch(0.98 0 0)",
              padding: "0.3rem 0.6rem",
              cursor: "pointer",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.1em",
            }}
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>

        {/* Red divider */}
        <div className="brut-divider" />

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              background: "oklch(0.06 0 0)",
              borderBottom: "3px solid oklch(0.55 0.22 27)",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "0.9rem 1.5rem",
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.3rem",
                      letterSpacing: "0.1em",
                      color: active
                        ? "oklch(0.55 0.22 27)"
                        : "oklch(0.98 0 0)",
                      borderBottom: "1px solid oklch(0.12 0 0)",
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid oklch(0.12 0 0)",
          padding: "1rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div className="brut-divider" style={{ marginBottom: "0.75rem" }} />
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            color: "oklch(0.35 0 0)",
          }}
        >
          AI ASSISTANT PRO — POWERED BY ADVANCED AI
        </span>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
