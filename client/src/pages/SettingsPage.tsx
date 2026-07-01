import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Panel = "locked" | "unlocked";

const RESTRICTION_PRESETS = [
  {
    id: "none",
    label: "NO RESTRICTIONS",
    desc: "Full unrestricted access. AI can discuss any topic.",
    color: "oklch(0.55 0.22 27)",
  },
  {
    id: "moderate",
    label: "MODERATE",
    desc: "Blocks explicit adult content and graphic violence. Everything else is allowed.",
    color: "oklch(0.65 0.18 60)",
  },
  {
    id: "safe",
    label: "SAFE MODE",
    desc: "Family-friendly filtering. Avoids all mature themes.",
    color: "oklch(0.55 0.18 145)",
  },
];

export default function SettingsPage() {
  const [panel, setPanel] = useState<Panel>("locked");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifiedPasscode, setVerifiedPasscode] = useState("");

  // Change passcode
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [changingPasscode, setChangingPasscode] = useState(false);

  // Restrictions
  const [selectedRestriction, setSelectedRestriction] = useState("none");
  const [customRestriction, setCustomRestriction] = useState("");
  const [restrictionMessage, setRestrictionMessage] = useState(
    "This content is restricted."
  );
  const [savingRestrictions, setSavingRestrictions] = useState(false);

  const settingsQuery = trpc.settings.get.useQuery();
  const verifyMutation = trpc.settings.verifyPasscode.useMutation();
  const updatePasscodeMutation = trpc.settings.updatePasscode.useMutation();
  const updateRestrictionsMutation = trpc.settings.updateRestrictions.useMutation();

  // Load current settings when unlocked
  const handleUnlock = async () => {
    if (!passcodeInput.trim()) return;
    setVerifying(true);
    try {
      const result = await verifyMutation.mutateAsync({
        passcode: passcodeInput,
      });
      if (result.valid) {
        setVerifiedPasscode(passcodeInput);
        setPanel("unlocked");
        setPasscodeInput("");
        // Load current restriction
        if (settingsQuery.data) {
          setSelectedRestriction(settingsQuery.data.restrictions);
          setRestrictionMessage(settingsQuery.data.restrictionMessage);
        }
        toast.success("Owner access granted.");
      } else {
        toast.error("Incorrect passcode. Access denied.");
        setPasscodeInput("");
      }
    } catch {
      toast.error("Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  const handleChangePasscode = async () => {
    if (!newPasscode || newPasscode !== confirmPasscode) {
      toast.error("Passcodes do not match.");
      return;
    }
    if (newPasscode.length < 4) {
      toast.error("Passcode must be at least 4 characters.");
      return;
    }
    setChangingPasscode(true);
    try {
      await updatePasscodeMutation.mutateAsync({
        currentPasscode: verifiedPasscode,
        newPasscode,
      });
      setVerifiedPasscode(newPasscode);
      setNewPasscode("");
      setConfirmPasscode("");
      toast.success("Passcode updated successfully.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update passcode.");
    } finally {
      setChangingPasscode(false);
    }
  };

  const handleSaveRestrictions = async () => {
    setSavingRestrictions(true);
    try {
      const restrictionValue =
        selectedRestriction === "custom"
          ? customRestriction
          : selectedRestriction;
      await updateRestrictionsMutation.mutateAsync({
        passcode: verifiedPasscode,
        restrictions: restrictionValue,
        restrictionMessage,
      });
      toast.success("Restrictions updated. Changes take effect immediately.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to save restrictions.");
    } finally {
      setSavingRestrictions(false);
    }
  };

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: 700,
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
              OWNER ACCESS ONLY
            </span>
          </div>
          <h1
            className="brut-heading"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", margin: 0 }}
          >
            OWNER
            <br />
            <span style={{ color: "oklch(0.55 0.22 27)" }}>SETTINGS</span>
          </h1>
          <div className="brut-divider" style={{ marginTop: "1rem" }} />
        </div>

        {/* ── LOCKED STATE ── */}
        {panel === "locked" && (
          <div className="fade-in">
            <div
              style={{
                background: "oklch(0.07 0 0)",
                border: "2px solid oklch(0.2 0 0)",
                padding: "2.5rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  border: "3px solid oklch(0.55 0.22 27)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                🔒
              </div>

              <div>
                <h2
                  className="brut-heading"
                  style={{ fontSize: "2rem", margin: "0 0 0.5rem" }}
                >
                  ENTER OWNER PASSCODE
                </h2>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.85rem",
                    color: "oklch(0.45 0 0)",
                    margin: 0,
                  }}
                >
                  This panel is restricted to the owner only.
                </p>
              </div>

              <div style={{ width: "100%", maxWidth: 320 }}>
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  placeholder="Enter passcode..."
                  className="brut-input"
                  style={{
                    textAlign: "center",
                    fontSize: "1.1rem",
                    letterSpacing: "0.2em",
                    marginBottom: "0.75rem",
                  }}
                  autoFocus
                />
                <button
                  onClick={handleUnlock}
                  disabled={!passcodeInput.trim() || verifying}
                  className="brut-btn brut-btn-filled"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    opacity: !passcodeInput.trim() || verifying ? 0.5 : 1,
                  }}
                >
                  {verifying ? "VERIFYING..." : "UNLOCK"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── UNLOCKED STATE ── */}
        {panel === "unlocked" && (
          <div
            className="fade-in"
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* Access granted banner */}
            <div
              style={{
                background: "oklch(0.08 0 0)",
                border: "2px solid oklch(0.55 0.22 27)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1rem" }}>🔓</span>
                <span
                  className="brut-label"
                  style={{ color: "oklch(0.55 0.22 27)" }}
                >
                  OWNER ACCESS GRANTED
                </span>
              </div>
              <button
                onClick={() => {
                  setPanel("locked");
                  setVerifiedPasscode("");
                }}
                className="brut-btn brut-btn-red"
                style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem" }}
              >
                LOCK
              </button>
            </div>

            {/* ── Content Restrictions ── */}
            <section>
              <h2
                className="brut-heading"
                style={{ fontSize: "2rem", marginBottom: "0.75rem" }}
              >
                CONTENT RESTRICTIONS
              </h2>
              <div className="brut-divider-thin" style={{ marginBottom: "1rem" }} />

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.85rem",
                  color: "oklch(0.5 0 0)",
                  marginBottom: "1rem",
                }}
              >
                Control what content the AI will discuss with regular users.
                These settings apply immediately to all new conversations.
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
              >
                {RESTRICTION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedRestriction(preset.id)}
                    style={{
                      background:
                        selectedRestriction === preset.id
                          ? "oklch(0.1 0 0)"
                          : "oklch(0.07 0 0)",
                      border: `2px solid ${selectedRestriction === preset.id ? preset.color : "oklch(0.18 0 0)"}`,
                      padding: "0.9rem 1rem",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.12s ease-out",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background:
                          selectedRestriction === preset.id
                            ? preset.color
                            : "oklch(0.25 0 0)",
                        flexShrink: 0,
                        transition: "background 0.12s",
                      }}
                    />
                    <div>
                      <div
                        className="brut-label"
                        style={{
                          color:
                            selectedRestriction === preset.id
                              ? preset.color
                              : "oklch(0.98 0 0)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {preset.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.8rem",
                          color: "oklch(0.5 0 0)",
                        }}
                      >
                        {preset.desc}
                      </div>
                    </div>
                  </button>
                ))}

                {/* Custom option */}
                <button
                  onClick={() => setSelectedRestriction("custom")}
                  style={{
                    background:
                      selectedRestriction === "custom"
                        ? "oklch(0.1 0 0)"
                        : "oklch(0.07 0 0)",
                    border: `2px solid ${selectedRestriction === "custom" ? "oklch(0.98 0 0)" : "oklch(0.18 0 0)"}`,
                    padding: "0.9rem 1rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.12s ease-out",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background:
                        selectedRestriction === "custom"
                          ? "oklch(0.98 0 0)"
                          : "oklch(0.25 0 0)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      className="brut-label"
                      style={{
                        color:
                          selectedRestriction === "custom"
                            ? "oklch(0.98 0 0)"
                            : "oklch(0.98 0 0)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      CUSTOM RULES
                    </div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.8rem",
                        color: "oklch(0.5 0 0)",
                      }}
                    >
                      Write your own restriction rules for the AI.
                    </div>
                  </div>
                </button>

                {selectedRestriction === "custom" && (
                  <div className="fade-in">
                    <label
                      className="brut-label"
                      style={{ display: "block", marginBottom: "0.4rem" }}
                    >
                      CUSTOM RESTRICTION RULES
                    </label>
                    <textarea
                      value={customRestriction}
                      onChange={(e) => setCustomRestriction(e.target.value)}
                      placeholder="Do not discuss competitor products. Avoid political topics. Keep responses professional..."
                      className="brut-textarea"
                      rows={4}
                    />
                  </div>
                )}
              </div>

              {/* Restriction message */}
              <div style={{ marginTop: "1rem" }}>
                <label
                  className="brut-label"
                  style={{ display: "block", marginBottom: "0.4rem" }}
                >
                  RESTRICTION MESSAGE (shown to users when blocked)
                </label>
                <input
                  type="text"
                  value={restrictionMessage}
                  onChange={(e) => setRestrictionMessage(e.target.value)}
                  className="brut-input"
                  placeholder="This content is restricted."
                />
              </div>

              <button
                onClick={handleSaveRestrictions}
                disabled={savingRestrictions}
                className="brut-btn brut-btn-filled"
                style={{
                  marginTop: "1rem",
                  fontSize: "1rem",
                  padding: "0.6rem 1.5rem",
                  opacity: savingRestrictions ? 0.5 : 1,
                }}
              >
                {savingRestrictions ? "SAVING..." : "SAVE RESTRICTIONS"}
              </button>
            </section>

            <div className="brut-divider-thin" />

            {/* ── Change Passcode ── */}
            <section>
              <h2
                className="brut-heading"
                style={{ fontSize: "2rem", marginBottom: "0.75rem" }}
              >
                CHANGE PASSCODE
              </h2>
              <div className="brut-divider-thin" style={{ marginBottom: "1rem" }} />

              <div
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                <div>
                  <label
                    className="brut-label"
                    style={{ display: "block", marginBottom: "0.3rem" }}
                  >
                    NEW PASSCODE
                  </label>
                  <input
                    type="password"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Enter new passcode..."
                    className="brut-input"
                  />
                </div>
                <div>
                  <label
                    className="brut-label"
                    style={{ display: "block", marginBottom: "0.3rem" }}
                  >
                    CONFIRM NEW PASSCODE
                  </label>
                  <input
                    type="password"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    placeholder="Confirm new passcode..."
                    className="brut-input"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleChangePasscode()
                    }
                  />
                </div>

                {newPasscode &&
                  confirmPasscode &&
                  newPasscode !== confirmPasscode && (
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.8rem",
                        color: "oklch(0.55 0.22 27)",
                      }}
                    >
                      Passcodes do not match.
                    </span>
                  )}

                <button
                  onClick={handleChangePasscode}
                  disabled={
                    !newPasscode ||
                    !confirmPasscode ||
                    newPasscode !== confirmPasscode ||
                    changingPasscode
                  }
                  className="brut-btn brut-btn-red"
                  style={{
                    fontSize: "1rem",
                    padding: "0.6rem 1.5rem",
                    opacity:
                      !newPasscode ||
                      !confirmPasscode ||
                      newPasscode !== confirmPasscode ||
                      changingPasscode
                        ? 0.5
                        : 1,
                  }}
                >
                  {changingPasscode ? "UPDATING..." : "UPDATE PASSCODE"}
                </button>
              </div>
            </section>

            <div className="brut-divider-thin" />

            {/* ── System Info ── */}
            <section>
              <h2
                className="brut-heading"
                style={{ fontSize: "2rem", marginBottom: "0.75rem" }}
              >
                SYSTEM INFO
              </h2>
              <div className="brut-divider-thin" style={{ marginBottom: "1rem" }} />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                {[
                  { label: "AI MODEL", value: "Claude Sonnet 4.5" },
                  { label: "IMAGE ENGINE", value: "GPT Image 2" },
                  { label: "STREAMING", value: "ENABLED" },
                  {
                    label: "CURRENT RESTRICTIONS",
                    value: settingsQuery.data?.restrictions?.toUpperCase() ?? "NONE",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "oklch(0.07 0 0)",
                      border: "1px solid oklch(0.15 0 0)",
                      padding: "0.75rem",
                    }}
                  >
                    <div
                      className="brut-label"
                      style={{
                        color: "oklch(0.4 0 0)",
                        marginBottom: "0.25rem",
                        fontSize: "0.6rem",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.1rem",
                        color: "oklch(0.98 0 0)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
