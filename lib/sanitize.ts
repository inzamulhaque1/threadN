/**
 * Input sanitization utilities to prevent prompt injection attacks
 * Separated from ai.ts to allow testing without OpenAI dependency
 */

/**
 * Sanitize user input to prevent prompt injection attacks
 * Removes or neutralizes common injection patterns
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== "string") return "";

  let sanitized = input
    // Remove common injection delimiters that could break out of context
    .replace(/```/g, "'''")
    .replace(/"""/g, "'''")
    // Neutralize role/system impersonation attempts
    .replace(/\b(system|assistant|user)\s*:/gi, "[ROLE]:")
    .replace(/\[INST\]/gi, "[INPUT]")
    .replace(/\[\/INST\]/gi, "[/INPUT]")
    .replace(/<\|im_start\|>/gi, "")
    .replace(/<\|im_end\|>/gi, "")
    .replace(/<\|system\|>/gi, "")
    .replace(/<\|user\|>/gi, "")
    .replace(/<\|assistant\|>/gi, "")
    // Remove XML-like tags that could manipulate context
    .replace(/<system>/gi, "")
    .replace(/<\/system>/gi, "")
    .replace(/<instructions?>/gi, "")
    .replace(/<\/instructions?>/gi, "")
    // Neutralize "ignore previous" type attacks
    .replace(/ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/gi, "[FILTERED]")
    .replace(/disregard\s+(all\s+)?(previous|above|prior)/gi, "[FILTERED]")
    .replace(/forget\s+(everything|all|what)/gi, "[FILTERED]")
    // Remove attempts to redefine the AI's role
    .replace(/you\s+are\s+(now|actually)/gi, "you were")
    .replace(/pretend\s+(to\s+be|you'?re)/gi, "[FILTERED]")
    .replace(/act\s+as\s+(if|though)/gi, "[FILTERED]")
    // Remove null bytes and other control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  return sanitized.trim();
}

/**
 * Wrap user content with clear delimiters to isolate it from prompt instructions
 */
export function wrapUserContent(content: string, label: string = "CONTENT"): string {
  const sanitized = sanitizeUserInput(content);
  return `<user_${label.toLowerCase()}>\n${sanitized}\n</user_${label.toLowerCase()}>`;
}

/**
 * Cost calculation for OpenAI API usage (gpt-4o-mini pricing)
 * $0.15 per 1M input tokens, $0.60 per 1M output tokens (estimate average)
 */
export function calculateCost(tokens: number): number {
  return (tokens / 1000000) * 0.375;
}
