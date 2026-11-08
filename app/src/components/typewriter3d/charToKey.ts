const ALIAS: Record<string, string> = { "!": "1", ";": ":", '"': "'" };

/**
 * Map a typed character to its keycap label on the typewriter keyboard.
 * Returns null for characters that have no key (shouldn't happen for the
 * poems we ship, but keeps callers safe).
 */
export function charToKey(ch: string): string | null {
  if (!ch) return null;
  if (ch === "\n") return "RETURN";
  if (ch === " ") return "SPACE";
  const u = ch.toUpperCase();
  return ALIAS[u] ?? u;
}
