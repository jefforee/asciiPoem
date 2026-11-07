import { useEffect, useState } from "react";

export type TypewriterState = {
  typed: string;
  index: number;
  done: boolean;
};

export function useTypewriter(
  text: string,
  base: number,
  paused: boolean,
): TypewriterState {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || index >= text.length) return;
    const ch = text[index];
    const delay =
      ch === "\n"
        ? base * 7
        : ".,;:!?".includes(ch)
          ? base * 5
          : base + Math.random() * base * 0.6;
    const t = setTimeout(() => setIndex((i) => i + 1), delay);
    return () => clearTimeout(t);
  }, [index, text, base, paused]);

  useEffect(() => {
    setIndex(0);
  }, [text]);

  return { typed: text.slice(0, index), index, done: index >= text.length };
}
