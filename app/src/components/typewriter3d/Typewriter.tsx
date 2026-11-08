import { useRef } from "react";
import Base from "./parts/Base";
import Carriage from "./parts/Carriage";
import Paper, { type PaperHandle } from "./parts/Paper";

type Props = {
  index: number;
  typed: string;
  ripping: boolean;
};

export default function Typewriter(_props: Props) {
  const paperRef = useRef<PaperHandle>(null);

  return (
    <group position={[0, 0, 0]}>
      <Base />
      <Carriage>
        <Paper ref={paperRef} />
      </Carriage>
      {/* ribbon, bail, typebars, keys land in following commits */}
    </group>
  );
}
