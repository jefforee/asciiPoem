import { forwardRef, type ReactNode, type Ref } from "react";
import type { Group } from "three";
import { CARRIAGE, PLATEN, KNOB } from "../constants";
import CRLever, { type CRLeverHandle } from "./CRLever";
import LineSpaceLever from "./LineSpaceLever";
import Platen from "./Platen";
import PlatenKnob from "./PlatenKnob";

type Props = {
  children?: ReactNode;
  crLeverRef?: Ref<CRLeverHandle>;
};

/**
 * Carriage is the sub-assembly that slides left per character and springs
 * back on carriage return. It holds the platen, knobs, paper, paper bail,
 * and the carriage-return lever. The parent ref drives its X translation.
 */
const Carriage = forwardRef<Group, Props>(function Carriage(
  { children, crLeverRef },
  ref,
) {
  return (
    <group ref={ref} position={[CARRIAGE.homeX, PLATEN.y, PLATEN.z]}>
      <Platen />
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
