import { forwardRef } from "react";
import type { Mesh } from "three";
import { PLATEN } from "../constants";
import { PALETTE } from "../palette";

/**
 * The platen is the rubber cylinder paper wraps around. It rotates around its
 * local Z axis when a line advances; the ref lets the mechanism drive that.
 * The cylinder is created with its axis on Y and then rotated so that axis
 * runs along world X.
 */
const Platen = forwardRef<Mesh>(function Platen(_props, ref) {
  return (
    <mesh
      ref={ref}
      rotation={[0, 0, Math.PI / 2]}
      castShadow
      receiveShadow
    >
      <cylinderGeometry
        args={[PLATEN.radius, PLATEN.radius, PLATEN.length, 48]}
      />
      <meshStandardMaterial
        color={PALETTE.platenRubber}
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  );
});

export default Platen;
