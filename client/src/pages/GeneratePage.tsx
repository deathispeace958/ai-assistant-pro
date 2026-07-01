import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const QUALITY_OPTIONS = [
  { id: "low", label: "FAST" },
  { id: "medium", label: "STANDARD" },
  { id: "high", label: "HIGH QUALITY" },
];

const PROMPT_SUGGESTIONS = [
  "A neon-lit cyberpunk city at midnight, rain reflecting on wet streets",
  "A lone astronaut standing on Mars, looking at Earth in the distance",
  "Abstract brutalist architecture, black and red, dramatic shadows",
  "A fierce dragon made of fire and lightning, ultra detailed",
  "Retro 80s synthwave sunset over an ocean, purple and orange",
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMutation = trpc.ai.generateImage.useMutation();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const result = await generateMutation.mutateAsync({
        prompt: prompt.trim(),
        quality,
      });
      setGeneratedImage(result.url ?? null);
      toast.success("Image generated!");
    } catch (err) {
      toast.error("Generation failed. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-generated-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(generatedImage, "_blank");
    }
  };

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          width: "100%",
          padding: "2rem 1.5rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-block",
              background: "oklch(0.55 0.22 27)",
              padding: "0.15rem 0.6rem",
              marginBottom: "0.75rem",
            }}
          >
            <span
              className="brut-label"
              style={{ color: "oklch(0.98 0 0)", fontSize: "0.65rem" }}
            >
              AI POWERED
            </span>
          </div>
          <h1
            className="brut-heading"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", margin: 0 }}
          >
            IMAGE
            <br />
            <span style={{ color: "oklch(0.55 0.22 27)" }}>GENERATOR</span>
          </h1>
          <div className="brut-divider" style={{ marginTop: "1rem" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: generatedImage ? "1fr 1fr" : "1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Input Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Prompt */}
            <div>
              <label
                className="brut-label"
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                DESCRIBE YOUR IMAGE
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A dramatic oil painting of a warrior standing at the edge of a cliff..."
                className="brut-textarea"
                rows={5}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleGenerate();
                }}
              />
              <span
                className="brut-label"
                style={{
                  color: "oklch(0.3 0 0)",
                  fontSize: "0.6rem",
                  marginTop: "0.25rem",
                  display: "block",
                }}
              >
                CTRL+ENTER TO GENERATE
              </span>
            </div>

            {/* Quality */}
            <div>
              <label
                className="brut-label"
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                QUALITY
              </label>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {QUALITY_OPTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q.id as "low" | "medium" | "high")}
                    className={`brut-btn ${quality === q.id ? "brut-btn-active" : ""}`}
                    style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <label
                className="brut-label"
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                PROMPT IDEAS
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {PROMPT_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(s)}
                    style={{
                      background: "oklch(0.08 0 0)",
                      border: "1px solid oklch(0.18 0 0)",
                      color: "oklch(0.55 0 0)",
                      padding: "0.45rem 0.75rem",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.8rem",
                      lineHeight: 1.4,
                      transition: "all 0.12s ease-out",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "oklch(0.55 0.22 27)";
                      (e.currentTarget as HTMLElement).style.color =
                        "oklch(0.98 0 0)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "oklch(0.18 0 0)";
                      (e.currentTarget as HTMLElement).style.color =
                        "oklch(0.55 0 0)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="brut-btn brut-btn-filled"
              style={{
                fontSize: "1.3rem",
                padding: "0.75rem",
                width: "100%",
                justifyContent: "center",
                opacity: !prompt.trim() || isGenerating ? 0.5 : 1,
              }}
            >
              {isGenerating ? (
                <>
                  <span className="spin" style={{ display: "inline-block" }}>
                    ⟳
                  </span>
                  &nbsp;GENERATING...
                </>
              ) : (
                "GENERATE IMAGE"
              )}
            </button>

            {isGenerating && (
              <div
                style={{
                  textAlign: "center",
                  color: "oklch(0.45 0 0)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                AI is creating your image... this may take 10–30 seconds.
              </div>
            )}
          </div>

          {/* Result Panel */}
          {generatedImage && (
            <div
              className="fade-in"
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <label className="brut-label">GENERATED IMAGE</label>
              <div
                style={{
                  border: "2px solid oklch(0.55 0.22 27)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={generatedImage}
                  alt="AI Generated"
                  style={{ width: "100%", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    background: "oklch(0.55 0.22 27)",
                    padding: "0.1rem 0.4rem",
                  }}
                >
                  <span
                    className="brut-label"
                    style={{ color: "oklch(0.98 0 0)", fontSize: "0.55rem" }}
                  >
                    AI GENERATED
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={handleDownload}
                  className="brut-btn"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  DOWNLOAD
                </button>
                <button
                  onClick={() => {
                    setGeneratedImage(null);
                    setPrompt("");
                  }}
                  className="brut-btn brut-btn-red"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  NEW IMAGE
                </button>
              </div>

              <div
                style={{
                  background: "oklch(0.08 0 0)",
                  border: "1px solid oklch(0.18 0 0)",
                  padding: "0.6rem 0.75rem",
                }}
              >
                <span
                  className="brut-label"
                  style={{
                    color: "oklch(0.4 0 0)",
                    fontSize: "0.6rem",
                    display: "block",
                    marginBottom: "0.2rem",
                  }}
                >
                  PROMPT USED
                </span>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.8rem",
                    color: "oklch(0.6 0 0)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {prompt}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
