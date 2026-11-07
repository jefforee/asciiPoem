import { useCallback, useRef, useState } from "react";
import Reader from "./components/Reader";
import Stage from "./components/Stage";
import { poems } from "./data/poems";

type Phase = "typing" | "ripping" | "reading";

export default function App() {
  const [p, setP] = useState(0);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [phase, setPhase] = useState<Phase>("typing");
  const timer = useRef<number | null>(null);

  const poem = poems[p];
  const base = Math.round(300 / speed);
  const prefix = poem.stanzas
    .slice(0, i)
    .map((s) => s.lines.join("\n"))
    .join("\n\n");

  const next = useCallback(() => {
    if (i < poem.stanzas.length - 1) {
      setI((n) => n + 1);
    } else {
      setPhase("ripping");
      timer.current = window.setTimeout(() => setPhase("reading"), 1300);
    }
  }, [poem, i]);

  const restart = (n?: number) => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    if (n !== undefined) setP(n);
    setI(0);
    setPhase("typing");
    setRun((r) => r + 1);
  };

  return (
    <div className="app">
      <div className="bar">
        {poems.map((x, n) => (
          <button
            key={x.id}
            className={n === p ? "on" : ""}
            onClick={() => restart(n)}
          >
            {x.title}
          </button>
        ))}
        <button onClick={() => setPaused((v) => !v)}>
          {paused ? "▶ play" : "❚❚ pause"}
        </button>
        <button onClick={() => restart()}>↺ replay</button>
        <label>
          speed
          <input
            type="range"
            min={1}
            max={10}
            value={speed}
            onInput={(e) => setSpeed(+(e.target as HTMLInputElement).value)}
          />
          {speed}
        </label>
      </div>
      {phase === "reading" ? (
        <Reader poem={poem} />
      ) : (
        <Stage
          key={`${p}-${i}-${run}`}
          stanza={poem.stanzas[i]}
          prefix={prefix}
          base={base}
          paused={paused}
          onDone={next}
          ripping={phase === "ripping"}
        />
      )}
      {phase === "typing" ? (
        <div className="cap">
          stanza {i + 1}/{poem.stanzas.length}
        </div>
      ) : null}
    </div>
  );
}
