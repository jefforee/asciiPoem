import { useCallback, useRef, useState } from "react";
import Reader from "./components/Reader";
import Stage from "./components/Stage";
import { poems } from "./data/poems";

type Phase = "typing" | "ripping" | "reading";

export default function App() {
  const [p, setP] = useState(0);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [phase, setPhase] = useState<Phase>("typing");
  const timer = useRef<number | null>(null);

  const poem = poems[p];
  const base = Math.round(300 / speed);

  const poemText = `${poem.title}\n${poem.text}`;

  const onDone = useCallback(() => {
    setPhase("ripping");
    timer.current = window.setTimeout(() => setPhase("reading"), 1300);
  }, []);

  const restart = (n?: number) => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    if (n !== undefined) setP(n);
    setPhase("typing");
    setRun((r) => r + 1);
  };

  return (
    <div className="app">
      <h1 className="page-title">Sheff Poems</h1>
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
          key={`${p}-${run}`}
          text={poemText}
          base={base}
          paused={paused}
          onDone={onDone}
          ripping={phase === "ripping"}
        />
      )}
    </div>
  );
}
