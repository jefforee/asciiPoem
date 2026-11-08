import Base from "./parts/Base";
import Carriage from "./parts/Carriage";

type Props = {
  index: number;
  typed: string;
  ripping: boolean;
};

export default function Typewriter(_props: Props) {
  return (
    <group position={[0, 0, 0]}>
      <Base />
      <Carriage />
      {/* paper, ribbon, bail, typebars, keys land in following commits */}
    </group>
  );
}
