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
          <pre className={styles.rlines}>{poem.text}</pre>
        </div>
      </div>
    </div>
  );
}
