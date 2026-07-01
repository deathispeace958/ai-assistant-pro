import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";

const FEATURES = [
  {
    label: "SMART CHAT",
    desc: "Unrestricted AI conversations with streaming responses and image analysis.",
    path: "/chat",
    tag: "NO LIMITS",
  },
  {
    label: "IMAGE GEN",
    desc: "Generate stunning AI images from any text prompt.",
    path: "/generate",
    tag: "AI POWERED",
  },
  {
    label: "ANIMATE",
    desc: "Upload a photo and animate it — make people move, dance, or talk.",
    path: "/animate",
    tag: "AI ANIMATION",
  },
  {
    label: "VIDEO GEN",
    desc: "Create short AI-generated videos from text descriptions.",
    path: "/video",
    tag: "COMING SOON",
  },
];

export default function Home() {
  return (
    <AppLayout>
      {/* Hero */}
      <section
        style={{
          padding: "5rem 1.5rem 3rem",
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "oklch(0.55 0.22 27)",
            padding: "0.2rem 0.8rem",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.9rem",
              letterSpacing: "0.2em",
              color: "oklch(0.98 0 0)",
            }}
          >
            UNRESTRICTED · INTELLIGENT · POWERFUL
          </span>
        </div>

        <h1
          className="brut-heading"
          style={{
            fontSize: "clamp(4rem, 12vw, 10rem)",
            marginBottom: "0.5rem",
            lineHeight: 0.9,
          }}
        >
          AI ASSISTANT
          <br />
          <span style={{ color: "oklch(0.55 0.22 27)" }}>PRO</span>
        </h1>

        <div className="brut-divider" style={{ margin: "2rem auto", maxWidth: 600 }} />

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1.1rem",
            color: "oklch(0.6 0 0)",
            maxWidth: 560,
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
          }}
        >
          A raw, unrestricted AI powerhouse. Chat, generate images, animate photos,
          and create videos — all in one place.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/chat">
            <button className="brut-btn brut-btn-filled" style={{ fontSize: "1.2rem", padding: "0.6rem 2rem" }}>
              START CHATTING
            </button>
          </Link>
          <Link href="/generate">
            <button className="brut-btn" style={{ fontSize: "1.2rem", padding: "0.6rem 2rem" }}>
              GENERATE IMAGES
            </button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section
        style={{
          padding: "2rem 1.5rem 4rem",
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1px",
            background: "oklch(0.2 0 0)",
            border: "1px solid oklch(0.2 0 0)",
          }}
        >
          {FEATURES.map((f) => (
            <Link key={f.path} href={f.path}>
              <div
                style={{
                  background: "oklch(0.06 0 0)",
                  padding: "2rem 1.5rem",
                  cursor: "pointer",
                  transition: "background 0.15s ease-out",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "oklch(0.1 0 0)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "oklch(0.06 0 0)")
                }
              >
                <div
                  style={{
                    display: "inline-block",
                    background: "oklch(0.55 0.22 27)",
                    padding: "0.1rem 0.5rem",
                    alignSelf: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.18em",
                      color: "oklch(0.98 0 0)",
                    }}
                  >
                    {f.tag}
                  </span>
                </div>
                <h2
                  className="brut-heading"
                  style={{ fontSize: "2.5rem", margin: 0 }}
                >
                  {f.label}
                </h2>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.9rem",
                    color: "oklch(0.55 0 0)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {f.desc}
                </p>
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    color: "oklch(0.55 0.22 27)",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "0.9rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  ENTER →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
