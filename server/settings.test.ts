import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("settings router", () => {
  it("returns default settings when db is unavailable", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.settings.get();
    expect(result).toHaveProperty("restrictions");
    expect(result).toHaveProperty("restrictionMessage");
  });

  it("rejects incorrect passcode verification", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.settings.verifyPasscode({
      passcode: "wrongpassword",
    });
    // When db is null, stored passcode defaults to "hackerx"
    expect(result.valid).toBe(false);
  });

  it("accepts correct default passcode", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.settings.verifyPasscode({
      passcode: "hackerx",
    });
    expect(result.valid).toBe(true);
  });

  it("rejects passcode update with wrong current passcode", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.settings.updatePasscode({
        currentPasscode: "wrongpassword",
        newPasscode: "newpass123",
      })
    ).rejects.toThrow("Invalid current passcode");
  });

  it("rejects restriction update with wrong passcode", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.settings.updateRestrictions({
        passcode: "wrongpassword",
        restrictions: "moderate",
      })
    ).rejects.toThrow("Invalid passcode");
  });
});

describe("chat router", () => {
  it("creates a session with default values", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);
    // DB is null so this will throw — test the error handling
    await expect(
      caller.chat.createSession({
        speakingMode: "casual",
        friendMode: false,
      })
    ).rejects.toThrow("Database unavailable");
  });

  it("returns empty history when db is unavailable", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.chat.getHistory({ sessionId: "test-session" });
    expect(result).toEqual([]);
  });
});

describe("ai router", () => {
  it("generateImage procedure exists and validates input", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);
    // Should throw on empty prompt
    await expect(
      caller.ai.generateImage({ prompt: "", quality: "medium" })
    ).rejects.toThrow();
  });

  it("generateVideo procedure exists and validates input", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.ai.generateVideo({ prompt: "" })
    ).rejects.toThrow();
  });
});
