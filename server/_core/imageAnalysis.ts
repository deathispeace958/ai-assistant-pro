/**
 * Image Analysis Module
 * Uses LLM vision capabilities to detect if an image contains minors
 * for child safety compliance
 */

import { invokeLLM } from "./llm";

export interface ImageAnalysisResult {
  containsMinor: boolean;
  confidence: "high" | "medium" | "low";
  reason: string;
}

/**
 * Analyze an image to detect if it contains minors
 * Returns true if the image likely contains a minor
 */
export async function analyzeImageForMinors(
  imageUrl: string
): Promise<ImageAnalysisResult> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are an image analysis system that detects whether an image contains minors (people under 18 years old). Analyze the image and respond with a JSON object containing: { containsMinor: boolean, confidence: 'high'|'medium'|'low', reason: string }. Be conservative - if unsure, mark as containing a minor.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
            {
              type: "text",
              text: "Does this image contain any people who appear to be minors (under 18 years old)? Respond only with valid JSON.",
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "image_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              containsMinor: {
                type: "boolean",
                description: "Whether the image contains a minor",
              },
              confidence: {
                type: "string",
                enum: ["high", "medium", "low"],
                description: "Confidence level of the assessment",
              },
              reason: {
                type: "string",
                description: "Explanation of the assessment",
              },
            },
            required: ["containsMinor", "confidence", "reason"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    if (!content || typeof content !== "string") {
      throw new Error("Invalid response from image analysis");
    }

    const result = JSON.parse(content) as ImageAnalysisResult;
    return result;
  } catch (error) {
    // On error, be conservative and assume it might contain a minor
    console.error("[Image Analysis] Error analyzing image:", error);
    return {
      containsMinor: true,
      confidence: "low",
      reason: "Unable to analyze image - blocking as precaution",
    };
  }
}

/**
 * Check if an image is safe for animation
 * Returns true if the image is safe (does NOT contain minors)
 * Fails closed: any indication of minors blocks animation
 */
export async function isImageSafeForAnimation(
  imageUrl: string
): Promise<boolean> {
  const analysis = await analyzeImageForMinors(imageUrl);

  // Fail closed: if ANY confidence level indicates a minor, reject
  if (analysis.containsMinor) {
    return false;
  }

  return true;
}
