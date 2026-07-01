import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const VIDEO_STYLES = [
  "Cinematic action sequence",
  "Peaceful nature timelapse",
  "Futuristic sci-fi scene",
  "Dramatic storm at sea",
  "Urban street life montage",
  "Fantasy epic battle",
];

export default function VideoPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<{
    url: string;
    message: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMutation = trpc.ai.generateVideo.useMutation();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const res = await generateMutation.mutateAsync({ prompt: prompt.trim() });
      setResult({ url: res.url ?? "", message: res.message });
      toast.success("Video preview generated!");
    } catch (err) {
      toast.error("Generation failed. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
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
              AI VIDEO GENERATION
            </span>
          </div>
          <h1
            className="brut-heading"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", margin: 0 }}
          >
            VIDEO
            <br />
            <span style={{ color: "oklch(0.55 0.22 27)" }}>GENERATOR</span>
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.9rem",
              color: "oklch(0.5 0 0)",
              marginTop: "0.5rem",
              maxWidth: 600,
            }}
          >
            Describe a scene and AI will generate a cinematic preview frame.
            Full video rendering is powered by advanced AI generation.
          </p>
          <div className="brut-divider" style={{ marginTop: "1rem" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: result ? "1fr 1fr" : "1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label
                className="brut-label"
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                DESCRIBE YOUR VIDEO
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A lone samurai walking through a misty bamboo forest at dawn, slow motion..."
                className="brut-textarea"
                rows={5}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleGenerate();
                }}
              />
            </div>

            {/* Style suggestions */}
            <div>
              <label
                className="brut-label"
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                STYLE PRESETS
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.35rem",
                }}
              >
                {VIDEO_STYLES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(s)}
                    style={{
                      background: "oklch(0.08 0 0)",
                      border: "1px solid oklch(0.18 0 0)",
                      color: "oklch(0.55 0 0)",
                      padding: "0.45rem 0.6rem",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.78rem",
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

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="brut-btn brut-btn-filled"
              style={{
                fontSize: "1.2rem",
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
                "GENERATE VIDEO"
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
                AI is generating your video preview... 15–30 seconds.
              </div>
            )}

            {/* Info box */}
            <div
              style={{
                background: "oklch(0.08 0 0)",
                border: "1px solid oklch(0.18 0 0)",
                padding: "0.75rem",
              }}
            >
              <span
                className="brut-label"
                style={{
                  color: "oklch(0.55 0.22 27)",
                  display: "block",
                  marginBottom: "0.3rem",
                }}
              >
                HOW IT WORKS
              </span>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                  color: "oklch(0.5 0 0)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Describe any scene and the AI generates a high-quality cinematic
                preview frame. The system uses advanced image generation to
                produce movie-like stills from your text description.
              </p>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div
              className="fade-in"
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <label className="brut-label">VIDEO PREVIEW FRAME</label>

              <div
                style={{
                  border: "2px solid oklch(0.55 0.22 27)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={result.url}
                  alt="Video Preview"
                  style={{ width: "100%", display: "block" }}
                />
                {/* Play overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      border: "3px solid oklch(0.98 0 0)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.5)",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", marginLeft: 4 }}>▶</span>
                  </div>
                </div>
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

              <div
                style={{
                  background: "oklch(0.08 0 0)",
                  border: "1px solid oklch(0.18 0 0)",
                  padding: "0.6rem 0.75rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.8rem",
                    color: "oklch(0.55 0 0)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {result.message}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(result.url);
                      const blob = await response.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `ai-video-preview-${Date.now()}.png`;
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch {
                      window.open(result.url, "_blank");
                    }
                  }}
                  className="brut-btn"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  DOWNLOAD FRAME
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setPrompt("");
                  }}
                  className="brut-btn brut-btn-red"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  NEW VIDEO
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
