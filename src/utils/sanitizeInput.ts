/**
 * Utility to sanitize user input and external content (Jira/GitHub) for AI prompts
 * to prevent prompt injection and maintain data integrity.
 */
export function sanitizeRequirements(input: unknown): string {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) { return ''; }
    if (typeof input === 'number' || typeof input === 'boolean') {
      input = String(input);
    } else {
      return '';
    }
  }

  let sanitized = (input as string)
    // Strip prompt override and role injection tokens
    .replace(/\[SYSTEM\]/gi, '')
    .replace(/\[ADMIN\]/gi, '')
    .replace(/\[OVERRIDE\]/gi, '')
    .replace(/\[INSTRUCTION\]/gi, '')
    .replace(/\[PROMPT\]/gi, '')
    // Remove script tags and embedded HTML
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove null bytes and control characters
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();

  // Strict truncation to prevent DoS via prompt overload
  const MAX_LENGTH = 50000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized;
}

/**
 * Format untrusted content with explicit prompt boundaries
 */
export function formatUntrustedInput(label: string, content: string): string {
  const safeContent = sanitizeRequirements(content);
  return `=== BEGIN UNTRUSTED DATA (${label}) ===\n${safeContent}\n=== END UNTRUSTED DATA (${label}) ===`;
}
