import { describe, expect, it } from "vitest";
import {
  containsCSAMContent,
  validateUserRequest,
  validateImagePrompt,
  validateVideoPrompt,
} from "./_core/contentSafety";

describe("CSAM Content Safety", () => {
  it("detects CSAM phrases", () => {
    expect(containsCSAMContent("child sexual abuse material")).toBe(true);
    expect(containsCSAMContent("child exploitation content")).toBe(true);
    expect(containsCSAMContent("minors in sexual situations")).toBe(true);
  });

  it("detects child + sexual keyword combinations", () => {
    expect(containsCSAMContent("child porn")).toBe(true);
    expect(containsCSAMContent("minor nude")).toBe(true);
    expect(containsCSAMContent("kid xxx")).toBe(true);
  });

  it("detects loli/shota references", () => {
    expect(containsCSAMContent("loli porn")).toBe(true);
    expect(containsCSAMContent("shota xxx")).toBe(true);
  });

  it("allows safe content with child keyword", () => {
    expect(containsCSAMContent("child development psychology")).toBe(false);
    expect(containsCSAMContent("children's book recommendations")).toBe(false);
    expect(containsCSAMContent("parenting advice for kids")).toBe(false);
    expect(containsCSAMContent("loli anime")).toBe(false);
    expect(containsCSAMContent("shota manga")).toBe(false);
  });

  it("throws error on validateUserRequest with CSAM", () => {
    expect(() => validateUserRequest("child sexual abuse")).toThrow();
    expect(() => validateUserRequest("normal conversation")).not.toThrow();
  });

  it("throws error on validateImagePrompt with CSAM", () => {
    expect(() => validateImagePrompt("generate child porn")).toThrow();
    expect(() => validateImagePrompt("generate a landscape")).not.toThrow();
  });

  it("throws error on validateVideoPrompt with CSAM", () => {
    expect(() => validateVideoPrompt("video of minors sexual")).toThrow();
    expect(() => validateVideoPrompt("cinematic action movie")).not.toThrow();
  });
});
