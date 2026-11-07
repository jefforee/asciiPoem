import { Fragment } from "react";

function rnd(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type Props = {
  text: string;
  offset?: number;
};

export default function Ink({ text, offset = 0 }: Props) {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === " ") {
      out.push(<Fragment key={i}> </Fragment>);
      continue;
    }
    out.push(
      <span
        key={i}
        style={{
          top: `${(rnd(i + offset) - 0.5) * 1.6}px`,
          opacity: 0.78 + rnd(i + offset + 99) * 0.22,
        }}
      >
        {c}
      </span>,
    );
  }
  return <>{out}</>;
}
