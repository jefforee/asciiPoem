import { useEffect } from "react";
import type { Stanza } from "../data/poems";
import { useTypewriter } from "../hooks/useTypewriter";
import Scene from "./typewriter3d/Scene";
import styles from "./Stage.module.css";

type Props = {
  stanza: Stanza;
  base: number;
  paused: boolean;
  onDone: () => void;
  ripping: boolean;
};

export default function Stage({
  stanza,
  base,
  paused,
  onDone,
  ripping,
}: Props) {
  const { typed, done } = useTypewriter(
    stanza.lines.join("\n"),
    base,
    paused,
  );

  useEffect(() => {
    if (!done || paused || ripping) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [done, paused, onDone, ripping]);

  return (
    <div className={styles.stage}>
      <Scene text={typed} animateFrom={0} ripping={ripping} />
    </div>
  );
}
