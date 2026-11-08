import { forwardRef } from "react";
import type { Group } from "three";
import { PLATEN } from "../constants";
import { PALETTE } from "../palette";

/**
 * The platen is the rubber cylinder paper wraps around. A smooth cylinder
 * oriented along world X. The ref is kept (useMechanism no longer drives
 * rotation, but downstream code may want it) — the cylinder itself stays
 * static because a solid rubber platen rotating about its symmetry axis
 * produces no visible motion anyway.
 */
const Platen = forwardRef<Group>(function Platen(_props, ref) {
  return (
    <group ref={ref} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[PLATEN.radius, PLATEN.radius, PLATEN.length, 48]}
        />
        <meshStandardMaterial
          color={PALETTE.platenRubber}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      {/* end caps — chrome rings */}
      {([-1, 1] as const).map((s) => (
        <mesh key={s} position={[0, s * (PLATEN.length / 2 + 0.02), 0]}>
          <cylinderGeometry
            args={[PLATEN.radius + 0.05, PLATEN.radius + 0.05, 0.1, 36]}
          />
          <meshStandardMaterial
            color={PALETTE.chrome}
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>
      ))}
    </group>
  );
});

export default Platen;
