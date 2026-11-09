import { useRef, useState, type CSSProperties } from "react";
import { toPng } from "html-to-image";
import type { Poem } from "../data/poems";
import { PAPER } from "./typewriter3d/constants";
import styles from "./Reader.module.css";

type Props = {
  poem: Poem;
};

export default function Reader({ poem }: Props) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const paperLines = [poem.title, ...poem.text.split("\n")];
  const fontScale = PAPER.glyphFontSize / (PAPER.width * PAPER.pixelsPerUnit);
  const paperStyle = {
    "--paper-font-size": `min(${fontScale * 36}rem, ${fontScale * 92}vw)`,
    "--paper-line-height": `${(PAPER.lineHeight * PAPER.pixelsPerUnit) / PAPER.glyphFontSize}em`,
    "--stanza-line-height": `${(PAPER.stanzaGap * PAPER.pixelsPerUnit) / PAPER.glyphFontSize}em`,
    "--title-gap-height": `${(PAPER.titleGap * PAPER.pixelsPerUnit) / PAPER.glyphFontSize}em`,
  } as CSSProperties;

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
        <div ref={paperRef} className={styles.bigsheet} style={paperStyle}>
          <div className={styles.paperText}>
            {paperLines.map((line, index) => (
              <div
                key={index}
                className={
                  index === 0
                    ? styles.paperTitle
                    : line
                      ? styles.paperLine
                      : styles.stanzaSpace
                }
              >
                {line || "\u00a0"}
              </div>
            ))}
          </div>
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
