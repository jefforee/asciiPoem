import Ink from "./Ink";
import styles from "./Paper.module.css";

type Props = {
  text: string;
  ripping: boolean;
};

const VISIBLE_FLAT = 3;
const CURVE = [1, 1, 1, 0.55, 0.3, 0.14];

function cx(...names: (string | false | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}

export default function Paper({ text, ripping }: Props) {
  const lines = text.split("\n");
  const n = lines.length;
  let off = 0;

  const rows = lines.map((ln, idx) => {
    const s = CURVE[Math.min(n - 1 - idx, CURVE.length - 1)];
    const o = off;
    off += ln.length + 1;
    return (
      <div
        className={styles.pline}
        key={idx}
        style={{
          height: `${s * 1.7}em`,
          transform: `scaleY(${s})`,
          opacity: s < 1 ? 0.3 + s * 0.65 : 1,
        }}
      >
        <Ink text={ln} offset={o} />
      </div>
    );
  });

  return (
    <div className={cx(styles.pholder, ripping && styles.ripping)}>
      <div className={cx(styles.pwrap, n > VISIBLE_FLAT && styles.folded)}>
        <div className={styles.pcurl} />
        <div className={styles.pwin}>
          <div className={styles.psheet} key={n}>
            {rows}
          </div>
        </div>
      </div>
      <div className={styles.pstub} />
    </div>
  );
}
