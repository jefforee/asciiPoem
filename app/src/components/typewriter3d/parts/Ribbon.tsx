import { PLATEN, RIBBON, STRIKE } from "../constants";
import { PALETTE } from "../palette";

/**
 * The inked ribbon runs horizontally from the left spool to the right spool,
 * passing just in front of the strike line. Flat strip, slight sag approximated
 * by a tiny downward dip at the mid-point via a second strip.
 */
export default function Ribbon() {
  const length = RIBBON.spoolX * 2;
  return (
    <group position={[0, STRIKE.y - 0.05, PLATEN.z + PLATEN.radius + 0.25]}>
      <mesh castShadow>
        <boxGeometry
          args={[length, RIBBON.stripHeight, RIBBON.stripWidth]}
        />
        <meshStandardMaterial
          color={PALETTE.ribbon}
          roughness={0.9}
        />
      </mesh>
      {/* guide posts */}
      {([-1, 1] as const).map((sx) => (
        <mesh
          key={sx}
          position={[sx * (RIBBON.spoolX - 1.4), 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.1, 0.1, 1.2, 12]} />
          <meshStandardMaterial
            color={PALETTE.chrome}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
