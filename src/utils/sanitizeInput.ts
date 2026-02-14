
/**
 * Utility to sanitize user input for requirements to prevent prompt injection
 * and ensure data integrity.
 */
export function sanitizeRequirements(input: string): string {
  // Remove potential prompt injection tokens
  let sanitized = input
    .replace(/\[SYSTEM\]/gi, '')
    .replace(/\[ADMIN\]/gi, '')
    .replace(/\[OVERRIDE\]/gi, '')
    .replace(/<script.*?>.*?<\/script>/gi, '') // Simple XSS protection
    .trim();

  // Limit length to prevent potential denial of service via large prompts
  const MAX_LENGTH = 50000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized;
}
