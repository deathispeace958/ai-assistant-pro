import { useState, useRef, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import { nanoid } from "nanoid";

const SPEAKING_MODES = [
  { id: "casual", label: "CASUAL" },
  { id: "formal", label: "FORMAL" },
  { id: "expert", label: "EXPERT" },
  { id: "creative", label: "CREATIVE" },
  { id: "concise", label: "CONCISE" },
];

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  streaming?: boolean;
};

export default function ChatPage() {
  const [sessionId] = useState(() => nanoid(16));
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [friendMode, setFriendMode] = useState(false);
  const [speakingMode, setSpeakingMode] = useState("casual");
  const [isStreaming, setIsStreaming] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    preview: string;
  } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const uploadImageMutation = trpc.chat.uploadImage.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(",")[1];
        const preview = e.target?.result as string;
        try {
          const result = await uploadImageMutation.mutateAsync({
            base64,
            mimeType: file.type,
            sessionId,
          });
          setUploadedImage({ url: result.url, preview });
          toast.success("Image uploaded — ask anything about it!");
        } catch {
          toast.error("Failed to upload image.");
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingImage(false);
      toast.error("Failed to read image.");
    }
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = {
      id: nanoid(),
      role: "user",
      content: text,
      imageUrl: uploadedImage?.url,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setUploadedImage(null);
    setIsStreaming(true);

    const assistantId = nanoid();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          imageUrl: userMsg.imageUrl,
          speakingMode,
          friendMode,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error("Stream request failed");

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          try {
            const parsed = JSON.parse(data);
            if (parsed.delta) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.delta }
                    : m
                )
              );
            }
            if (parsed.done || parsed.error) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, streaming: false } : m
                )
              );
            }
          } catch {
            // skip
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Chat error. Please try again.");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: m.content || "Sorry, something went wrong.",
                  streaming: false,
                }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, streaming: false } : m
        )
      );
    }
  }, [input, isStreaming, sessionId, uploadedImage, speakingMode, friendMode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  const clearChat = () => {
    setMessages([]);
    setUploadedImage(null);
  };

  return (
    <AppLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 130px)",
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
          padding: "0 1rem",
        }}
      >
        {/* ── Controls Bar ── */}
        <div
          style={{
            padding: "1rem 0 0.75rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {/* Speaking modes */}
          <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
            {SPEAKING_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSpeakingMode(mode.id)}
                className={`brut-btn ${speakingMode === mode.id ? "brut-btn-active" : ""}`}
                style={{ fontSize: "0.75rem", padding: "0.25rem 0.65rem" }}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div
            style={{
              width: 1,
              height: 28,
              background: "oklch(0.2 0 0)",
              flexShrink: 0,
            }}
          />

          {/* Friend Mode */}
          <button
            onClick={() => setFriendMode(!friendMode)}
            className={`brut-btn ${friendMode ? "brut-btn-active" : ""}`}
            style={{ fontSize: "0.8rem", padding: "0.25rem 0.75rem" }}
          >
            {friendMode ? "👋 FRIEND MODE ON" : "FRIEND MODE"}
          </button>

          {/* Clear */}
          <button
            onClick={clearChat}
            className="brut-btn brut-btn-red"
            style={{
              fontSize: "0.75rem",
              padding: "0.25rem 0.65rem",
              marginLeft: "auto",
            }}
          >
            CLEAR
          </button>
        </div>

        <div className="brut-divider-thin" />

        {/* ── Messages ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                color: "oklch(0.35 0 0)",
              }}
            >
              <div
                className="brut-heading"
                style={{ fontSize: "3rem", marginBottom: "0.5rem" }}
              >
                ASK ANYTHING
              </div>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.9rem",
                  color: "oklch(0.4 0 0)",
                }}
              >
                No restrictions. Upload images for analysis. Switch modes above.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className="fade-in"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                gap: "0.35rem",
              }}
            >
              <span
                className="brut-label"
                style={{
                  color:
                    msg.role === "user"
                      ? "oklch(0.55 0.22 27)"
                      : "oklch(0.5 0 0)",
                }}
              >
                {msg.role === "user" ? "YOU" : "AI ASSISTANT PRO"}
              </span>

              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Uploaded"
                  style={{
                    maxWidth: 240,
                    maxHeight: 180,
                    border: "2px solid oklch(0.2 0 0)",
                    objectFit: "cover",
                  }}
                />
              )}

              <div
                style={{
                  maxWidth: "80%",
                  background:
                    msg.role === "user"
                      ? "oklch(0.55 0.22 27)"
                      : "oklch(0.09 0 0)",
                  border: `1px solid ${msg.role === "user" ? "oklch(0.55 0.22 27)" : "oklch(0.18 0 0)"}`,
                  padding: "0.75rem 1rem",
                  color: "oklch(0.98 0 0)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.93rem",
                  lineHeight: 1.6,
                }}
              >
                {msg.role === "assistant" ? (
                  <div className="chat-markdown">
                    <Streamdown>{msg.content}</Streamdown>
                    {msg.streaming && (
                      <span
                        className="pulse-red"
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 14,
                          background: "oklch(0.55 0.22 27)",
                          marginLeft: 3,
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="brut-divider-thin" />

        {/* ── Input Area ── */}
        <div style={{ padding: "0.75rem 0 1rem", flexShrink: 0 }}>
          {/* Image preview */}
          {uploadedImage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.5rem",
                padding: "0.5rem",
                background: "oklch(0.09 0 0)",
                border: "1px solid oklch(0.2 0 0)",
              }}
            >
              <img
                src={uploadedImage.preview}
                alt="Preview"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "cover",
                  border: "1px solid oklch(0.2 0 0)",
                }}
              />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                  color: "oklch(0.6 0 0)",
                  flex: 1,
                }}
              >
                Image attached — ask about it
              </span>
              <button
                onClick={() => setUploadedImage(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "oklch(0.55 0.22 27)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                REMOVE
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            {/* Image upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="brut-btn"
              style={{
                padding: "0.65rem 0.75rem",
                fontSize: "1.1rem",
                flexShrink: 0,
                alignSelf: "flex-end",
              }}
              title="Upload image for analysis"
            >
              {uploadingImage ? (
                <span className="spin" style={{ display: "inline-block" }}>
                  ⟳
                </span>
              ) : (
                "📷"
              )}
            </button>

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

            {/* Text input */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                friendMode
                  ? "Hey! What's on your mind? 👋"
                  : "Ask anything — no restrictions..."
              }
              className="brut-textarea"
              rows={2}
              style={{ flex: 1, maxHeight: 120 }}
              disabled={isStreaming}
            />

            {/* Send / Stop */}
            {isStreaming ? (
              <button
                onClick={stopStreaming}
                className="brut-btn brut-btn-red"
                style={{
                  padding: "0.65rem 1rem",
                  alignSelf: "flex-end",
                  flexShrink: 0,
                }}
              >
                STOP
              </button>
            ) : (
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="brut-btn brut-btn-filled"
                style={{
                  padding: "0.65rem 1.2rem",
                  alignSelf: "flex-end",
                  flexShrink: 0,
                  opacity: !input.trim() ? 0.4 : 1,
                }}
              >
                SEND
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.4rem",
            }}
          >
            <span
              className="brut-label"
              style={{ color: "oklch(0.3 0 0)", fontSize: "0.6rem" }}
            >
              ENTER TO SEND · SHIFT+ENTER FOR NEW LINE
            </span>
            <span
              className="brut-label"
              style={{
                color: friendMode
                  ? "oklch(0.55 0.22 27)"
                  : "oklch(0.3 0 0)",
                fontSize: "0.6rem",
              }}
            >
              MODE: {speakingMode.toUpperCase()}
              {friendMode ? " · FRIEND MODE" : ""}
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
