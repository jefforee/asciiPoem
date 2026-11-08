import { useEffect } from "react";
import { useTypewriter } from "../hooks/useTypewriter";
import Scene from "./typewriter3d/Scene";
import styles from "./Stage.module.css";

type Props = {
  text: string;
  base: number;
  paused: boolean;
  onDone: () => void;
  ripping: boolean;
};

export default function Stage({ text, base, paused, onDone, ripping }: Props) {
  const { typed, done } = useTypewriter(text, base, paused);

  useEffect(() => {
    if (!done || paused || ripping) return;
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [done, paused, onDone, ripping]);

  return (
    <div className={styles.stage}>
      <Scene text={typed} animateFrom={0} ripping={ripping} />
    </div>
  );
}
