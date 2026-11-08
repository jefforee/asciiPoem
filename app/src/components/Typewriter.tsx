import { useEffect, useState } from "react";
import styles from "./Typewriter.module.css";

type Props = {
  ch: string | undefined;
  tick: number;
  base: number;
};

const ROWS: { keys: string; ret?: boolean }[] = [
  { keys: "1234567890-'" },
  { keys: "QWERTYUIOP" },
  { keys: "ASDFGHJKL:", ret: true },
  { keys: "ZXCVBNM,.?" },
];

const ALIAS: Record<string, string> = { "!": "1", ";": ":", '"': "'" };

function norm(c: string): string {
  if (c === "\n") return "RETURN";
  if (c === " ") return "SPACE";
  const u = c.toUpperCase();
  return ALIAS[u] ?? u;
}

function cx(...names: (string | false | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}

export default function Typewriter({ ch, tick, base }: Props) {
  const [down, setDown] = useState<string | null>(null);

  useEffect(() => {
    if (!tick || !ch) return;
    setDown(norm(ch));
    const t = setTimeout(
      () => setDown(null),
      Math.max(50, Math.min(160, base * 0.8)),
    );
    return () => clearTimeout(t);
  }, [tick, ch, base]);

  const K = (k: string, wide = false) => (
    <div
      key={k}
      className={cx(styles.key, wide && styles.wide, down === k && styles.down)}
    >
      <span>{k}</span>
    </div>
  );

  return (
    <div className={styles.tw3d}>
      <div className={styles.roller}>
        <i className={cx(styles.knob, styles.knobL)} />
        <div className={styles.cyl} />
        <i className={cx(styles.knob, styles.knobR)} />
      </div>
      <div className={styles.body}>
        <div className={styles.grille} />
        <div className={styles.plate}>
          <span>S H E F F</span>
        </div>
        {ROWS.map((r, ri) => (
          <div
            className={styles.krow}
            key={ri}
            style={{ transform: `translateX(${ri * 1.1}em)` }}
          >
            {r.keys.split("").map((k) => K(k))}
            {r.ret ? K("RETURN", true) : null}
          </div>
        ))}
        <div className={styles.krow}>
          <div
            className={cx(
              styles.key,
              styles.space,
              down === "SPACE" && styles.down,
            )}
          />
        </div>
      </div>
      <div className={styles.base} />
    </div>
  );
}
