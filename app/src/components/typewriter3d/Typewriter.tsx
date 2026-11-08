import { forwardRef } from "react";
import type { Group } from "three";

type Props = {
  index: number;
  typed: string;
  ripping: boolean;
};

const Typewriter = forwardRef<Group, Props>(function Typewriter(_props, ref) {
  return (
    <group ref={ref} position={[0, 0, 0]}>
      {/* chassis, carriage, paper, ribbon, typebars, keys land here in later commits */}
    </group>
  );
});

export default Typewriter;
