import { useState } from "react";
import { toast } from "sonner";

interface AgeVerificationModalProps {
  onVerified: () => void;
}

export default function AgeVerificationModal({
  onVerified,
}: AgeVerificationModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [attempting, setAttempting] = useState(false);

  const handleConfirm = () => {
    if (!confirmed) {
      toast.error("You must confirm you are 18+ to continue.");
      return;
    }

    setAttempting(true);
    // Store verification in localStorage with timestamp
    const verificationData = {
      verified: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("ageVerified", JSON.stringify(verificationData));

    // Small delay for UX
    setTimeout(() => {
      setAttempting(false);
      onVerified();
    }, 300);
  };

  const handleDeny = () => {
    toast.error("You must be 18+ to access this application.");
    // Optionally redirect or show a goodbye message
    setTimeout(() => {
      window.location.href = "https://www.google.com";
    }, 1500);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="fade-in"
        style={{
          background: "oklch(0.08 0 0)",
          border: "3px solid oklch(0.55 0.22 27)",
          padding: "3rem 2.5rem",
          maxWidth: 500,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Warning badge */}
        <div
          style={{
            display: "inline-block",
            background: "oklch(0.55 0.22 27)",
            padding: "0.2rem 0.8rem",
            alignSelf: "center",
            marginBottom: "0.5rem",
          }}
        >
          <span
            className="brut-label"
            style={{ color: "oklch(0.98 0 0)", fontSize: "0.7rem" }}
          >
            ⚠ AGE VERIFICATION REQUIRED
          </span>
        </div>

        {/* Heading */}
        <h1
          className="brut-heading"
          style={{
            fontSize: "2.5rem",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          EXPLICIT CONTENT
          <br />
          <span style={{ color: "oklch(0.55 0.22 27)" }}>WARNING</span>
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.95rem",
            color: "oklch(0.6 0 0)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          This application provides unrestricted AI conversations, including
          explicit and sexual content by default. By entering, you confirm you
          are at least 18 years old and accept full responsibility for the
          content you generate or view.
        </p>

        {/* Checkbox */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem",
            background: "oklch(0.06 0 0)",
            border: `2px solid ${confirmed ? "oklch(0.55 0.22 27)" : "oklch(0.2 0 0)"}`,
            cursor: "pointer",
            transition: "all 0.12s ease-out",
          }}
          onClick={() => setConfirmed(!confirmed)}
        >
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            style={{
              width: 20,
              height: 20,
              cursor: "pointer",
              accentColor: "oklch(0.55 0.22 27)",
            }}
          />
          <label
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.9rem",
              color: "oklch(0.7 0 0)",
              cursor: "pointer",
              flex: 1,
              margin: 0,
            }}
          >
            I confirm I am 18+ and accept the content policy
          </label>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleDeny}
            className="brut-btn brut-btn-red"
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              fontSize: "0.95rem",
            }}
          >
            DENY
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmed || attempting}
            className="brut-btn brut-btn-filled"
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              fontSize: "0.95rem",
              opacity: !confirmed || attempting ? 0.5 : 1,
            }}
          >
            {attempting ? "VERIFYING..." : "I AGREE & ENTER"}
          </button>
        </div>

        {/* Footer text */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.75rem",
            color: "oklch(0.35 0 0)",
            margin: 0,
          }}
        >
          This verification is stored locally and will not be asked again.
        </p>
      </div>
    </div>
  );
}
