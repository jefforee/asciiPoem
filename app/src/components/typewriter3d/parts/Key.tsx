import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import type { Group } from "three";
import { KEYBOARD } from "../constants";
import { PALETTE } from "../palette";

export type KeyHandle = {
  press(): void;
};

type Props = {
  label?: string;
  widthMult?: number;
  accent?: boolean;
};

const Key = forwardRef<KeyHandle, Props>(function Key(
  { label, widthMult = 1, accent = false },
  ref,
) {
  const capRef = useRef<Group>(null);
  const startedAt = useRef(0);
  const active = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      press() {
        startedAt.current = performance.now();
        active.current = true;
      },
    }),
    [],
  );

  useFrame(() => {
    const el = capRef.current;
    if (!el) return;
    let dy = 0;
    if (active.current) {
      const t = (performance.now() - startedAt.current) / KEYBOARD.pressMs;
      if (t >= 1) {
        active.current = false;
      } else {
        const p = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        const e = p * p * (3 - 2 * p);
        dy = -KEYBOARD.travel * e;
      }
    }
    el.position.y = dy;
  });

  const w = KEYBOARD.keySize * widthMult;
  const d = KEYBOARD.keySize;

  return (
    <group>
      {/* stationary skirt around the key hole */}
      <mesh position={[0, -KEYBOARD.keyHeight / 2 - 0.12, 0]} receiveShadow>
        <boxGeometry args={[w + 0.14, 0.1, d + 0.14]} />
        <meshStandardMaterial color={PALETTE.keyRim} roughness={0.55} />
      </mesh>
      {/* keycap group — animated */}
      <group ref={capRef}>
        <RoundedBox
          args={[w, KEYBOARD.keyHeight, d]}
          radius={0.12}
          smoothness={4}
          castShadow
        >
          <meshStandardMaterial
            color={accent ? PALETTE.keyAccent : PALETTE.keyCap}
            roughness={0.42}
            metalness={0.08}
          />
        </RoundedBox>
        {label && (
          <Text
            position={[0, KEYBOARD.keyHeight / 2 + 0.005, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={Math.min(w, d) * 0.42}
            color={PALETTE.keyInk}
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        )}
      </group>
    </group>
  );
});

export default Key;
