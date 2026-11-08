import { PAPER_BAIL } from "../constants";
import { PALETTE } from "../palette";

/**
 * Horizontal chrome bar that pins the paper against the platen. Two small
 * rubber rollers ride on the paper near the bar's centre.
 */
export default function PaperBail() {
  return (
    <group position={[0, PAPER_BAIL.y, PAPER_BAIL.z]}>
      {/* main bar */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry
          args={[PAPER_BAIL.radius, PAPER_BAIL.radius, PAPER_BAIL.length, 16]}
        />
        <meshStandardMaterial
          color={PALETTE.chrome}
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>
      {/* two bail rollers */}
      {([-1, 1] as const).map((sx) => (
        <mesh
          key={sx}
          position={[sx * 3.4, -0.35, 0.05]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.35, 0.35, 0.9, 16]} />
          <meshStandardMaterial
            color={PALETTE.platenRubber}
            roughness={0.9}
          />
        </mesh>
      ))}
      {/* side arms that hinge to the carriage */}
      {([-1, 1] as const).map((sx) => (
        <mesh
          key={`arm${sx}`}
          position={[sx * (PAPER_BAIL.length / 2 - 0.1), -0.2, -0.6]}
          castShadow
        >
          <boxGeometry args={[0.18, 0.5, 1.2]} />
          <meshStandardMaterial
            color={PALETTE.chrome}
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}
