import { forwardRef, type ReactNode, type Ref } from "react";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import { CARRIAGE, PLATEN, KNOB } from "../constants";
import { PALETTE } from "../palette";
import CRLever, { type CRLeverHandle } from "./CRLever";
import LineSpaceLever from "./LineSpaceLever";
import Platen from "./Platen";
import PlatenKnob from "./PlatenKnob";

type Props = {
  children?: ReactNode;
  crLeverRef?: Ref<CRLeverHandle>;
  platenRef?: Ref<Group>;
};

/**
 * Carriage is the sub-assembly that slides left per character and springs
 * back on carriage return. It holds the platen, knobs, paper, paper bail,
 * and the carriage-return lever. The parent ref drives its X translation.
 */
const Carriage = forwardRef<Group, Props>(function Carriage(
  { children, crLeverRef, platenRef },
  ref,
) {
  return (
    <group ref={ref} position={[CARRIAGE.homeX, PLATEN.y, PLATEN.z]}>
      {([-1, 1] as const).map((side) => (
        <group
          key={side}
          position={[side * (PLATEN.length / 2 + 0.32), 0, 0]}
        >
          <RoundedBox
            args={[0.62, 1.9, 0.8]}
            position={[0, -1, 0.12]}
            radius={0.12}
            smoothness={6}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={PALETTE.frameDark}
              roughness={0.42}
              metalness={0.62}
            />
          </RoundedBox>
          <RoundedBox
            args={[1.05, 0.22, 1.15]}
            position={[0, -1.94, 0.12]}
            radius={0.1}
            smoothness={6}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={PALETTE.frameDark}
              roughness={0.42}
              metalness={0.62}
            />
          </RoundedBox>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.48, 0.48, 0.72, 32]} />
            <meshStandardMaterial
              color={PALETTE.chrome}
              roughness={0.32}
              metalness={0.82}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.76, 24]} />
            <meshStandardMaterial
              color={PALETTE.frameBlack}
              roughness={0.5}
              metalness={0.4}
            />
          </mesh>
        </group>
      ))}
      <Platen ref={platenRef} />
      <group position={[-(PLATEN.length / 2 + KNOB.length / 2 + KNOB.gap), 0, 0]}>
        <PlatenKnob side="left" />
      </group>
      <group position={[PLATEN.length / 2 + KNOB.length / 2 + KNOB.gap, 0, 0]}>
        <PlatenKnob side="right" />
      </group>
      <CRLever ref={crLeverRef} />
      <LineSpaceLever />
      {children}
    </group>
  );
});

export default Carriage;
