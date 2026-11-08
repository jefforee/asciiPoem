import type { Poem } from "../data/poems";
import styles from "./Reader.module.css";

type Props = {
  poem: Poem;
};

export default function Reader({ poem }: Props) {
  return (
    <div className={styles.reader}>
      <div className={styles.bigshadow}>
        <div className={styles.bigsheet}>
          <h2>{poem.title}</h2>
          {poem.stanzas.map((s, k) => (
            <pre key={k} className={styles.rlines}>
              {s.lines.join("\n")}
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
}
