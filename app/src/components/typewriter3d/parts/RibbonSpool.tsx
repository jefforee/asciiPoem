import { RIBBON } from "../constants";
import { PALETTE } from "../palette";

type Props = {
  side: "left" | "right";
};

export default function RibbonSpool({ side }: Props) {
  const x = (side === "left" ? -1 : 1) * RIBBON.spoolX;
  return (
    <group position={[x, RIBBON.spoolY, RIBBON.spoolZ]}>
      {/* axle */}
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.18, RIBBON.spoolHeight + 0.6, 16]} />
        <meshStandardMaterial
          color={PALETTE.chrome}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      {/* bottom flange */}
      <mesh position={[0, -RIBBON.spoolHeight / 2, 0]} castShadow>
        <cylinderGeometry
          args={[RIBBON.spoolRadius + 0.15, RIBBON.spoolRadius + 0.15, 0.12, 36]}
        />
        <meshStandardMaterial
          color={PALETTE.frameDark}
          roughness={0.5}
          metalness={0.6}
        />
      </mesh>
      {/* ribbon wind — short cylinder of ribbon ink-dark material */}
      <mesh castShadow>
        <cylinderGeometry
          args={[RIBBON.spoolRadius, RIBBON.spoolRadius, RIBBON.spoolHeight, 36]}
        />
        <meshStandardMaterial
          color={PALETTE.ribbon}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      {/* top flange */}
      <mesh position={[0, RIBBON.spoolHeight / 2, 0]} castShadow>
        <cylinderGeometry
          args={[RIBBON.spoolRadius + 0.15, RIBBON.spoolRadius + 0.15, 0.12, 36]}
        />
        <meshStandardMaterial
          color={PALETTE.frameDark}
          roughness={0.5}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}
