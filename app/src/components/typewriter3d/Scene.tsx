import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Typewriter from "./Typewriter";
import styles from "./Scene.module.css";

type Props = {
  text: string;
  animateFrom: number;
  header?: string;
  ripping: boolean;
};

export default function Scene({ text, animateFrom, header, ripping }: Props) {
  return (
    <div className={styles.scene}>
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={["#eee2cc"]} />
        <PerspectiveCamera makeDefault position={[0, 20, 48]} fov={34} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[18, 32, 18]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <directionalLight position={[-16, 12, -6]} intensity={0.35} />
        <Typewriter
          text={text}
          animateFrom={animateFrom}
          header={header}
          ripping={ripping}
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.2, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <shadowMaterial opacity={0.28} />
        </mesh>
        <OrbitControls
          enablePan={false}
          minDistance={26}
          maxDistance={80}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 9, 0]}
        />
      </Canvas>
    </div>
  );
}
