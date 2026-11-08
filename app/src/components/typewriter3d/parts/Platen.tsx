import { forwardRef } from "react";
import type { Group } from "three";
import { PLATEN } from "../constants";
import { PALETTE } from "../palette";

/**
 * The platen is the rubber cylinder paper wraps around. Modelled as a
 * group so the mechanism can rotate it about its symmetry axis on line
 * feed; a visible dark marker stripe makes that rotation legible.
 *
 * The outer group carries a Z-rotation that orients the cylinder's axis
 * along world X. Setting rotation.y on the group then rotates every child
 * about the platen's own symmetry axis (because Euler order is XYZ, Y is
 * applied before Z).
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
      {/* visible rotation marker — a thin dark stripe along the cylinder */}
      <mesh position={[0, 0, PLATEN.radius - 0.015]}>
        <boxGeometry args={[0.07, PLATEN.length * 0.98, 0.04]} />
        <meshStandardMaterial
          color={PALETTE.frameBlack}
          roughness={0.5}
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
