import { useRef } from "react";
import Base from "./parts/Base";
import Carriage from "./parts/Carriage";
import Paper, { type PaperHandle } from "./parts/Paper";
import PaperBail from "./parts/PaperBail";
import Ribbon from "./parts/Ribbon";
import RibbonSpool from "./parts/RibbonSpool";

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
      <RibbonSpool side="left" />
      <RibbonSpool side="right" />
      <Ribbon />
      <Carriage>
        <Paper ref={paperRef} />
        <PaperBail />
      </Carriage>
      {/* typebasket and keyboard land in following commits */}
    </group>
  );
}
