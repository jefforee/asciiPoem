import { TYPEBAR } from "./constants";

/**
 * Map a typed character to a typebar index. Space and newline carry no
 * hammer, so return null. Every other character hashes deterministically to
 * one of the N bars; adjacent letters land on different bars, giving the
 * basket a visibly alive motion.
 */
export function charToBarIndex(ch: string): number | null {
  if (ch === " " || ch === "\n" || !ch) return null;
  const code = ch.charCodeAt(0);
  // small prime scramble so A/B/C don't fall on adjacent bars
  return ((code * 7 + 11) % TYPEBAR.count + TYPEBAR.count) % TYPEBAR.count;
}
