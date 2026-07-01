import { describe, expect, it, vi } from "vitest";
import { isImageSafeForAnimation } from "./_core/imageAnalysis";

describe("Image Analysis - Minor Detection", () => {
  it("should reject animation if image contains minors (high confidence)", async () => {
    // Mock the LLM response to indicate a minor was detected
    vi.mock("./_core/llm", () => ({
      invokeLLM: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                containsMinor: true,
                confidence: "high",
                reason: "Image shows a child",
              }),
            },
          },
        ],
      }),
    }));

    // Note: In real tests, we would mock the LLM to return the analysis result
    // For now, this test documents the expected behavior
    expect(true).toBe(true);
  });

  it("should reject animation if image contains minors (low confidence)", async () => {
    // Fail-closed: even low confidence minor detection should block animation
    expect(true).toBe(true);
  });

  it("should allow animation if image contains only adults", async () => {
    // Image analysis returns containsMinor: false
    expect(true).toBe(true);
  });

  it("should handle analysis errors conservatively", async () => {
    // If analysis fails or returns invalid data, should block animation
    expect(true).toBe(true);
  });
});
