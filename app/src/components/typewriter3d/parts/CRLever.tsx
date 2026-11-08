import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { KNOB, PLATEN } from "../constants";
import { PALETTE } from "../palette";

export type CRLeverHandle = {
  swing(): void;
};

const SWING_MS = 480;
const SWING_RAD = -0.9;

/**
 * Carriage-return lever: a chrome arm attached to the back of the left
 * platen knob with a small ball handle. Swings forward and back when CR
 * fires. Parented to the carriage so it tracks horizontal travel.
 */
const CRLever = forwardRef<CRLeverHandle>(function CRLever(_, ref) {
  const pivotRef = useRef<Group>(null);
  const startedAt = useRef(0);
  const active = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      swing() {
        startedAt.current = performance.now();
        active.current = true;
      },
    }),
    [],
  );

  useFrame(() => {
    const g = pivotRef.current;
    if (!g) return;
    let r = 0;
    if (active.current) {
      const t = (performance.now() - startedAt.current) / SWING_MS;
      if (t >= 1) {
        active.current = false;
      } else {
        const p = t < 0.35 ? t / 0.35 : 1 - (t - 0.35) / 0.65;
        const e = p * p * (3 - 2 * p);
        r = SWING_RAD * e;
      }
    }
    g.rotation.x = r;
  });

  // Pivot sits just behind and above the left knob.
  const pivotX = -(PLATEN.length / 2 + KNOB.length / 2 + KNOB.gap);
  return (
    <group position={[pivotX - 0.4, 0.2, -0.4]}>
      <group ref={pivotRef}>
        {/* arm */}
        <mesh
          position={[-0.4, 0.6, 1.0]}
          rotation={[-0.35, 0, Math.PI / 2.1]}
          castShadow
        >
          <cylinderGeometry args={[0.1, 0.1, 2.6, 14]} />
          <meshStandardMaterial
            color={PALETTE.chrome}
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>
        {/* handle ball */}
        <mesh position={[-0.9, 1.1, 1.85]} castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={PALETTE.keyCap}
            roughness={0.45}
          />
        </mesh>
      </group>
    </group>
  );
});

export default CRLever;
