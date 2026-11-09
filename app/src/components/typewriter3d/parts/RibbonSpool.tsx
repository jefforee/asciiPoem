import { RoundedBox } from "@react-three/drei";
import { RIBBON } from "../constants";
import { PALETTE } from "../palette";

type Props = {
  side: "left" | "right";
};

export default function RibbonSpool({ side }: Props) {
  const x = (side === "left" ? -1 : 1) * RIBBON.spoolX;
  const spoolBottom = RIBBON.spoolY - RIBBON.spoolHeight / 2 - 0.12;
  const mountHeight = spoolBottom - 5.48;
  return (
    <group position={[x, RIBBON.spoolY, RIBBON.spoolZ]}>
      <RoundedBox
        args={[1.15, 0.14, 1.1]}
        position={[0, 5.48 - RIBBON.spoolY, 0]}
        radius={0.12}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={PALETTE.bodyMid}
          roughness={0.48}
          metalness={0.08}
        />
      </RoundedBox>
      <mesh position={[0, (5.55 + spoolBottom) / 2 - RIBBON.spoolY, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.3, mountHeight - 0.07, 20]} />
        <meshStandardMaterial
          color={PALETTE.chrome}
          roughness={0.3}
          metalness={0.82}
        />
      </mesh>
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
