import { forwardRef } from "react";
import type { Group } from "three";
import { KNOB } from "../constants";
import { PALETTE } from "../palette";

type Props = {
  side: "left" | "right";
};

const PlatenKnob = forwardRef<Group, Props>(function PlatenKnob({ side }, ref) {
  const sign = side === "left" ? -1 : 1;
  // The knob is a short cylinder mounted on the end of the platen, axis = X.
  return (
    <group ref={ref} position={[sign * 0, 0, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[KNOB.radius, KNOB.radius, KNOB.length, 36]} />
        <meshStandardMaterial
          color={PALETTE.knob}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>
      {/* cap on the outer face */}
      <mesh
        position={[sign * (KNOB.length / 2 + 0.01), 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry
          args={[KNOB.radius * 0.6, KNOB.radius * 0.6, 0.1, 32]}
        />
        <meshStandardMaterial
          color={PALETTE.knobHi}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
      {/* knurling — ring of thin tabs around the outer rim */}
      {Array.from({ length: 20 }).map((_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              sign * (KNOB.length / 2 - 0.05),
              Math.sin(a) * (KNOB.radius - 0.05),
              Math.cos(a) * (KNOB.radius - 0.05),
            ]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <boxGeometry args={[0.18, 0.12, 0.12]} />
            <meshStandardMaterial
              color={PALETTE.frameDark}
              roughness={0.5}
              metalness={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
});

export default PlatenKnob;
