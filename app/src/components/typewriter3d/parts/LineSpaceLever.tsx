import { KNOB, PLATEN } from "../constants";
import { PALETTE } from "../palette";

/**
 * Small line-space lever on the right side of the carriage. A
 * static detail; selecting single/double spacing isn't modelled.
 */
export default function LineSpaceLever() {
  const x = PLATEN.length / 2 + KNOB.length / 2 + KNOB.gap + 0.6;
  return (
    <group position={[x, 0.4, -0.3]}>
      <mesh rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.18, 1.6, 0.14]} />
        <meshStandardMaterial
          color={PALETTE.chrome}
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>
      {/* tip */}
      <mesh position={[0.18, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={PALETTE.frameDark} roughness={0.5} />
      </mesh>
    </group>
  );
}
