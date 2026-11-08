import { forwardRef, useImperativeHandle, useRef } from "react";
import { KEYBOARD } from "../constants";
import Key, { type KeyHandle } from "./Key";

export type KeyboardHandle = {
  press(label: string): void;
};

type RowSpec = { keys: string; hasReturn?: boolean };

const ROWS: RowSpec[] = [
  { keys: "1234567890-'" },
  { keys: "QWERTYUIOP" },
  { keys: "ASDFGHJKL:", hasReturn: true },
  { keys: "ZXCVBNM,.?" },
];

const GAP = 0.2;

function layoutRow(spec: RowSpec): Array<{ key: string; x: number; wide: number }> {
  const items: Array<{ key: string; wide: number }> = spec.keys
    .split("")
    .map((k) => ({ key: k, wide: 1 }));
  if (spec.hasReturn) items.push({ key: "RETURN", wide: 1.9 });

  let cursor = 0;
  const placed = items.map(({ key, wide }) => {
    const w = KEYBOARD.keySize * wide;
    const entry = { key, x: cursor + w / 2, wide };
    cursor += w + GAP;
    return entry;
  });
  const total = cursor - GAP;
  for (const p of placed) p.x -= total / 2;
  return placed;
}

const Keyboard = forwardRef<KeyboardHandle>(function Keyboard(_, ref) {
  const keys = useRef<Record<string, KeyHandle | null>>({});

  useImperativeHandle(
    ref,
    () => ({
      press(label: string) {
        keys.current[label]?.press();
      },
    }),
    [],
  );

  return (
    <group>
      {ROWS.map((row, ri) => {
        // ri=0 is the back row, ri=3 is the front char row.
        // Front char row sits at frontZ - rowGap (one row in front of spacebar).
        const z = KEYBOARD.frontZ - (ROWS.length - ri) * KEYBOARD.rowGap;
        const y = KEYBOARD.baseY + (ROWS.length - ri) * KEYBOARD.tier;
        const stagger = ri * 0.35;
        return layoutRow(row).map((p) => (
          <group key={`${ri}-${p.key}`} position={[p.x + stagger, y, z]}>
            <Key
              ref={(el) => {
                keys.current[p.key] = el;
              }}
              label={p.key === "RETURN" ? "⏎" : p.key}
              widthMult={p.wide}
            />
          </group>
        ));
      })}
      {/* spacebar — front-most row, extra wide */}
      <group position={[0, KEYBOARD.baseY, KEYBOARD.frontZ]}>
        <Key
          ref={(el) => {
            keys.current["SPACE"] = el;
          }}
          widthMult={9}
        />
      </group>
    </group>
  );
});

export default Keyboard;
