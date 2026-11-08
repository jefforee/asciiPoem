import { forwardRef, type ReactNode } from "react";
import type { Group } from "three";
import { CARRIAGE, PLATEN, KNOB } from "../constants";
import Platen from "./Platen";
import PlatenKnob from "./PlatenKnob";

type Props = {
  children?: ReactNode;
};

/**
 * Carriage is the sub-assembly that slides left per character and springs
 * back on carriage return. It holds the platen, knobs, paper (added later),
 * and paper bail. The parent ref drives its X translation.
 */
const Carriage = forwardRef<Group, Props>(function Carriage({ children }, ref) {
  return (
    <group ref={ref} position={[CARRIAGE.homeX, PLATEN.y, PLATEN.z]}>
      {/* platen axis sits at carriage origin so paper + knobs line up */}
      <Platen />
      <group position={[-(PLATEN.length / 2 + KNOB.length / 2 + KNOB.gap), 0, 0]}>
        <PlatenKnob side="left" />
      </group>
      <group position={[PLATEN.length / 2 + KNOB.length / 2 + KNOB.gap, 0, 0]}>
        <PlatenKnob side="right" />
      </group>
      {children}
    </group>
  );
});

export default Carriage;
