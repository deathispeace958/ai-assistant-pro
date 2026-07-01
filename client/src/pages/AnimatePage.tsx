import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ANIMATION_STYLES = [
  { id: "dance", label: "DANCE", emoji: "💃", desc: "Make them dance energetically" },
  { id: "talk", label: "TALK", emoji: "🗣️", desc: "Make them speak expressively" },
  { id: "wave", label: "WAVE", emoji: "👋", desc: "Make them wave hello" },
  { id: "jump", label: "JUMP", emoji: "🦘", desc: "Make them jump joyfully" },
  { id: "custom", label: "CUSTOM", emoji: "✨", desc: "Describe your own animation" },
];

export default function AnimatePage() {
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    preview: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [animationStyle, setAnimationStyle] = useState("dance");
  const [customPrompt, setCustomPrompt] = useState("");
  const [resultImage, setResultImage] = useState<{
    url: string;
    label: string;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = trpc.chat.uploadImage.useMutation();
  const animateMutation = trpc.ai.animatePhoto.useMutation();

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB.");
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      try {
        const result = await uploadMutation.mutateAsync({
          base64,
          mimeType: file.type,
          sessionId: "animate-" + Date.now(),
        });
        setUploadedImage({
          url: result.url,
          preview: dataUrl,
          base64,
          mimeType: file.type,
        });
        setResultImage(null);
        toast.success("Photo uploaded — ready to animate!");
      } catch {
        toast.error("Failed to upload photo.");
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnimate = async () => {
    if (!uploadedImage || isAnimating) return;
    setIsAnimating(true);
    setResultImage(null);
    try {
      const result = await animateMutation.mutateAsync({
        imageUrl: uploadedImage.url,
        animationStyle,
        prompt:
          animationStyle === "custom" ? customPrompt : undefined,
      });
      setResultImage({ url: result.url ?? "", label: result.label });
      toast.success("Animation complete!");
    } catch (err) {
      toast.error("Animation failed. Please try again.");
      console.error(err);
    } finally {
      setIsAnimating(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImage?.url) return;
    try {
      const response = await fetch(resultImage.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-animation-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultImage.url, "_blank");
    }
  };

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: 1000,
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
              AI ANIMATION — NOT A DEEPFAKE
            </span>
          </div>
          <h1
            className="brut-heading"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", margin: 0 }}
          >
            ANIMATE
            <br />
            <span style={{ color: "oklch(0.55 0.22 27)" }}>A PHOTO</span>
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
            Upload a photo and use AI to generate an animated artistic version.
            All results are clearly labeled as AI-generated artwork — not real
            videos or deepfakes.
          </p>
          <div className="brut-divider" style={{ marginTop: "1rem" }} />
        </div>

        {/* Disclaimer Banner */}
        <div
          style={{
            background: "oklch(0.08 0 0)",
            border: "2px solid oklch(0.55 0.22 27)",
            padding: "0.75rem 1rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>⚠️</span>
          <div>
            <span
              className="brut-label"
              style={{
                color: "oklch(0.55 0.22 27)",
                display: "block",
                marginBottom: "0.2rem",
              }}
            >
              AI ANIMATION DISCLAIMER
            </span>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.82rem",
                color: "oklch(0.6 0 0)",
                margin: 0,
              }}
            >
              This feature creates AI-generated artistic animations. Results are
              clearly labeled as AI artwork and are not intended to deceive or
              misrepresent real people. Do not use for harmful purposes.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Upload Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Upload zone */}
            <div>
              <label
                className="brut-label"
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                UPLOAD PHOTO
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${uploadedImage ? "oklch(0.55 0.22 27)" : "oklch(0.25 0 0)"}`,
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "oklch(0.07 0 0)",
                  transition: "all 0.15s ease-out",
                  minHeight: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "oklch(0.55 0.22 27)";
                  (e.currentTarget as HTMLElement).style.background =
                    "oklch(0.09 0 0)";
                }}
                onMouseLeave={(e) => {
                  if (!uploadedImage) {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "oklch(0.25 0 0)";
                  }
                  (e.currentTarget as HTMLElement).style.background =
                    "oklch(0.07 0 0)";
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleImageUpload(file);
                }}
              >
                {uploadingImage ? (
                  <span
                    className="spin brut-heading"
                    style={{
                      fontSize: "2rem",
                      display: "inline-block",
                      color: "oklch(0.55 0.22 27)",
                    }}
                  >
                    ⟳
                  </span>
                ) : uploadedImage ? (
                  <>
                    <img
                      src={uploadedImage.preview}
                      alt="Uploaded"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        objectFit: "contain",
                      }}
                    />
                    <span
                      className="brut-label"
                      style={{ color: "oklch(0.55 0.22 27)" }}
                    >
                      CLICK TO CHANGE PHOTO
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: "2.5rem" }}>📷</span>
                    <span
                      className="brut-heading"
                      style={{ fontSize: "1.2rem", color: "oklch(0.4 0 0)" }}
                    >
                      CLICK OR DRAG TO UPLOAD
                    </span>
                    <span
                      className="brut-label"
                      style={{ color: "oklch(0.3 0 0)" }}
                    >
                      JPG, PNG, WEBP — MAX 10MB
                    </span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                  e.target.value = "";
                }}
              />
            </div>

            {/* Animation Style */}
            <div>
              <label
                className="brut-label"
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                ANIMATION STYLE
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.4rem",
                }}
              >
                {ANIMATION_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setAnimationStyle(style.id)}
                    className={`brut-btn ${animationStyle === style.id ? "brut-btn-active" : ""}`}
                    style={{
                      fontSize: "0.8rem",
                      padding: "0.5rem 0.6rem",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "0.1rem",
                    }}
                  >
                    <span>
                      {style.emoji} {style.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom prompt */}
            {animationStyle === "custom" && (
              <div className="fade-in">
                <label
                  className="brut-label"
                  style={{ display: "block", marginBottom: "0.4rem" }}
                >
                  DESCRIBE THE ANIMATION
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="The person is doing a martial arts kata, powerful and focused..."
                  className="brut-textarea"
                  rows={3}
                />
              </div>
            )}

            {/* Animate Button */}
            <button
              onClick={handleAnimate}
              disabled={!uploadedImage || isAnimating}
              className="brut-btn brut-btn-filled"
              style={{
                fontSize: "1.2rem",
                padding: "0.75rem",
                width: "100%",
                justifyContent: "center",
                opacity: !uploadedImage || isAnimating ? 0.5 : 1,
              }}
            >
              {isAnimating ? (
                <>
                  <span className="spin" style={{ display: "inline-block" }}>
                    ⟳
                  </span>
                  &nbsp;ANIMATING...
                </>
              ) : (
                "ANIMATE PHOTO"
              )}
            </button>

            {isAnimating && (
              <div
                style={{
                  textAlign: "center",
                  color: "oklch(0.45 0 0)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                AI is creating your animation... 15–30 seconds.
              </div>
            )}
          </div>

          {/* Result Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <label className="brut-label">ANIMATION RESULT</label>

            {resultImage ? (
              <div className="fade-in">
                {/* AI Label Banner */}
                <div
                  style={{
                    background: "oklch(0.55 0.22 27)",
                    padding: "0.4rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0",
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>🤖</span>
                  <span
                    className="brut-label"
                    style={{
                      color: "oklch(0.98 0 0)",
                      fontSize: "0.65rem",
                    }}
                  >
                    AI ANIMATION — ARTIFICIALLY GENERATED ARTWORK
                  </span>
                </div>

                <div
                  style={{
                    border: "2px solid oklch(0.55 0.22 27)",
                    borderTop: "none",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={resultImage.url}
                    alt="AI Animation"
                    style={{ width: "100%", display: "block" }}
                  />
                </div>

                {/* Disclaimer */}
                <div
                  style={{
                    background: "oklch(0.07 0 0)",
                    border: "1px solid oklch(0.18 0 0)",
                    borderTop: "none",
                    padding: "0.6rem 0.75rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.75rem",
                      color: "oklch(0.45 0 0)",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {resultImage.label}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <button
                    onClick={handleDownload}
                    className="brut-btn"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    DOWNLOAD
                  </button>
                  <button
                    onClick={() => setResultImage(null)}
                    className="brut-btn brut-btn-red"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    CLEAR
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  border: "2px dashed oklch(0.18 0 0)",
                  minHeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "0.75rem",
                  color: "oklch(0.3 0 0)",
                }}
              >
                {isAnimating ? (
                  <>
                    <span
                      className="spin brut-heading"
                      style={{
                        fontSize: "3rem",
                        display: "inline-block",
                        color: "oklch(0.55 0.22 27)",
                      }}
                    >
                      ⟳
                    </span>
                    <span
                      className="brut-heading"
                      style={{ fontSize: "1.2rem", color: "oklch(0.55 0.22 27)" }}
                    >
                      CREATING ANIMATION...
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: "3rem" }}>🎭</span>
                    <span
                      className="brut-heading"
                      style={{ fontSize: "1.2rem" }}
                    >
                      RESULT WILL APPEAR HERE
                    </span>
                    <span
                      className="brut-label"
                      style={{ color: "oklch(0.3 0 0)" }}
                    >
                      UPLOAD A PHOTO AND CLICK ANIMATE
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
