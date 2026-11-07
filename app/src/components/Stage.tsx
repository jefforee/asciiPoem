import { useEffect } from "react";
import type { Stanza } from "../data/poems";
import { useTypewriter } from "../hooks/useTypewriter";
import Paper from "./Paper";
import Typewriter from "./Typewriter";
import styles from "./Stage.module.css";

type Props = {
  stanza: Stanza;
  prefix: string;
  base: number;
  paused: boolean;
  onDone: () => void;
  ripping: boolean;
};

export default function Stage({
  stanza,
  prefix,
  base,
  paused,
  onDone,
  ripping,
}: Props) {
  const { typed, index, done } = useTypewriter(
    stanza.lines.join("\n"),
    base,
    paused,
  );

  useEffect(() => {
    if (!done || paused || ripping) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [done, paused, onDone, ripping]);

  const text = (prefix ? prefix + "\n\n" : "") + typed;

  return (
    <div className={styles.stage}>
      <pre className={styles.art}>{stanza.art}</pre>
      <Paper text={text} ripping={ripping} />
      <Typewriter ch={typed[index - 1]} tick={index} base={base} />
    </div>
  );
}
