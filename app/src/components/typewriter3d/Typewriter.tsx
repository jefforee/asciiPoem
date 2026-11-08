import { useRef } from "react";
import Base from "./parts/Base";
import Carriage from "./parts/Carriage";
import type { CRLeverHandle } from "./parts/CRLever";
import Keyboard, { type KeyboardHandle } from "./parts/Keyboard";
import Paper, { type PaperHandle } from "./parts/Paper";
import PaperBail from "./parts/PaperBail";
import Ribbon from "./parts/Ribbon";
import RibbonSpool from "./parts/RibbonSpool";
import Typebasket, { type TypebasketHandle } from "./parts/Typebasket";

type Props = {
  index: number;
  typed: string;
  ripping: boolean;
};

export default function Typewriter(_props: Props) {
  const paperRef = useRef<PaperHandle>(null);
  const basketRef = useRef<TypebasketHandle>(null);
  const keyboardRef = useRef<KeyboardHandle>(null);
  const crLeverRef = useRef<CRLeverHandle>(null);

  return (
    <group position={[0, 0, 0]}>
      <Base />
      <RibbonSpool side="left" />
      <RibbonSpool side="right" />
      <Ribbon />
      <Typebasket ref={basketRef} />
      <Carriage crLeverRef={crLeverRef}>
        <Paper ref={paperRef} />
        <PaperBail />
      </Carriage>
      <Keyboard ref={keyboardRef} />
    </group>
  );
}
