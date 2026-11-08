import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Poem } from "../data/poems";
import styles from "./Reader.module.css";

type Props = {
  poem: Poem;
};

export default function Reader({ poem }: Props) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const saveAsPng = async () => {
    if (!paperRef.current) return;

    setSaving(true);
    setError("");

    try {
      await document.fonts.ready;
      const image = await toPng(paperRef.current, {
        pixelRatio: 2,
        backgroundColor: "#faf4e4",
        style: {
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.06), transparent 6%, transparent 94%, rgba(0, 0, 0, 0.06)), #faf4e4",
        },
      });
      const link = document.createElement("a");
      link.download = `${poem.id}-poem.png`;
      link.href = image;
      link.click();
    } catch (cause) {
      console.error("Failed to save the poem as a PNG.", cause);
      setError("Could not save the paper. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.reader}>
      <div className={styles.bigshadow}>
        <div ref={paperRef} className={styles.bigsheet}>
          <h2>{poem.title}</h2>
          <pre className={styles.rlines}>{poem.text}</pre>
        </div>
      </div>
      <div className={styles.saveControls}>
        <button type="button" onClick={saveAsPng} disabled={saving}>
          {saving ? "Saving..." : "Save as PNG"}
        </button>
        {error && (
          <span className={styles.saveError} role="alert">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
