import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { TYPEBAR } from "../constants";
import { PALETTE } from "../palette";

export type TypebarHandle = {
  strike(): void;
};

type Props = {
  yaw: number;
};

const Typebar = forwardRef<TypebarHandle, Props>(function Typebar(
  { yaw },
  ref,
) {
  const pivotRef = useRef<Group>(null);
  const startedAt = useRef(0);
  const active = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      strike() {
        startedAt.current = performance.now();
        active.current = true;
      },
    }),
    [],
  );

  useFrame(() => {
    const g = pivotRef.current;
    if (!g) return;
    let pitch = TYPEBAR.restPitch;
    if (active.current) {
      const t = (performance.now() - startedAt.current) / TYPEBAR.strikeMs;
      if (t >= 1) {
        active.current = false;
      } else {
        // triangle: 0 → 1 over 40% of window, 1 → 0 over 60%
        const p = t < 0.4 ? t / 0.4 : 1 - (t - 0.4) / 0.6;
        const e = p * p * (3 - 2 * p); // smoothstep
        pitch = TYPEBAR.restPitch + e * (TYPEBAR.strikePitch - TYPEBAR.restPitch);
      }
    }
    g.rotation.x = pitch;
  });

  return (
    <group rotation={[0, yaw, 0]}>
      <group ref={pivotRef} rotation={[TYPEBAR.restPitch, 0, 0]}>
        {/* bar — shifted so one end sits at the pivot and the other extends in -Z */}
        <RoundedBox
          args={[TYPEBAR.width, TYPEBAR.thickness, TYPEBAR.length]}
          position={[0, 0, -TYPEBAR.length / 2]}
          radius={0.055}
          smoothness={4}
          castShadow
        >
          <meshStandardMaterial
            color={PALETTE.chrome}
            roughness={0.28}
            metalness={0.86}
          />
        </RoundedBox>
        {/* hammer slug at the far end */}
        <RoundedBox
          args={[TYPEBAR.hammerW, TYPEBAR.hammerH, TYPEBAR.hammerD]}
          position={[0, 0.05, -TYPEBAR.length + 0.05]}
          radius={0.04}
          smoothness={4}
          castShadow
        >
          <meshStandardMaterial
            color={PALETTE.frameDark}
            roughness={0.32}
            metalness={0.7}
          />
        </RoundedBox>
      </group>
    </group>
  );
});

export default Typebar;
