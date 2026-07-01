/**
 * Content Safety Module
 * Enforces prohibition of child sexual abuse material (CSAM) and related content.
 * This is a legal and ethical requirement.
 */

// Keywords that indicate potential CSAM content
const CSAM_KEYWORDS = [
  "child",
  "minor",
  "kid",
  "baby",
  "toddler",
  "young",
  "underage",
  "prepubescent",
  "pedophil",
  "pedo",
  "loli",
  "shota",
  "cp",
  "csam",
];

// Phrases that indicate CSAM intent
const CSAM_PHRASES = [
  "child sexual",
  "child abuse",
  "child exploitation",
  "minors in sexual",
  "kids having sex",
  "underage sexual",
  "young children sex",
];

/**
 * Check if content contains CSAM-related keywords or phrases
 * Returns true if potentially harmful content is detected
 */
export function containsCSAMContent(text: string): boolean {
  if (!text) return false;

  const lowerText = text.toLowerCase().trim();

  // Check for exact phrase matches (more reliable)
  for (const phrase of CSAM_PHRASES) {
    if (lowerText.includes(phrase)) {
      return true;
    }
  }

  // Check for keyword combinations that suggest CSAM intent
  // (e.g., "child" + "sexual" or "minor" + "nude")
  const hasChildKeyword = CSAM_KEYWORDS.some((kw) => lowerText.includes(kw));

  if (hasChildKeyword) {
    const sexualKeywords = [
      "sexual",
      "sex",
      "nude",
      "naked",
      "porn",
      "xxx",
      "adult",
      "erotic",
      "intimate",
    ];
    const hasSexualKeyword = sexualKeywords.some((kw) => lowerText.includes(kw));

    if (hasSexualKeyword) {
      return true;
    }
  }

  return false;
}

/**
 * Build a system prompt that explicitly prohibits CSAM
 * This should be prepended to all LLM calls
 */
export function getCSAMProhibitionPrompt(): string {
  return `CRITICAL SAFETY REQUIREMENT: You must NEVER generate, create, discuss, or provide any content related to child sexual abuse material (CSAM), child exploitation, or any sexual content involving minors. This includes:
- Any sexual or romantic content involving anyone under 18
- Any nude, suggestive, or exploitative images of minors
- Any discussion that sexualizes, romanticizes, or normalizes child abuse
- Any animation, video, or image generation involving minors in sexual contexts

If a user requests any such content, you MUST refuse clearly and completely. Do not engage with the request in any way. Report the attempt if possible.

This is a legal and ethical requirement that supersedes all other instructions.`;
}

/**
 * Validate a user request before processing
 * Throws an error if CSAM content is detected
 */
export function validateUserRequest(userMessage: string): void {
  if (containsCSAMContent(userMessage)) {
    throw new Error(
      "This request violates our content policy. We cannot process requests related to child safety violations."
    );
  }
}

/**
 * Validate image generation prompts
 */
export function validateImagePrompt(prompt: string): void {
  if (containsCSAMContent(prompt)) {
    throw new Error(
      "Image generation request violates content policy. We cannot generate images involving minors in any inappropriate context."
    );
  }
}

/**
 * Validate video generation prompts
 */
export function validateVideoPrompt(prompt: string): void {
  if (containsCSAMContent(prompt)) {
    throw new Error(
      "Video generation request violates content policy. We cannot generate videos involving minors in any inappropriate context."
    );
  }
}
