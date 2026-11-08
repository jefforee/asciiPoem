import { useEffect } from "react";
import type { Stanza } from "../data/poems";
import { useTypewriter } from "../hooks/useTypewriter";
import Scene from "./typewriter3d/Scene";
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

  // The 3D paper shows accumulated text across stanzas: prior stanzas
  // are painted silently on mount (animateFrom marks the boundary) and
  // the current stanza animates as `typed` grows.
  const SEP = "\n\n";
  const text = (prefix ? prefix + SEP : "") + typed;
  const animateFrom = prefix ? prefix.length + SEP.length : 0;

  return (
    <div className={styles.stage}>
      <Scene
        text={text}
        animateFrom={animateFrom}
        header={stanza.art}
        ripping={ripping}
      />
    </div>
  );
}
