import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Typewriter from "./Typewriter";
import styles from "./Scene.module.css";

type Props = {
  text: string;
  animateFrom: number;
  ripping: boolean;
};

export default function Scene({ text, animateFrom, ripping }: Props) {
  return (
    <div className={styles.scene}>
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={["#eee2cc"]} />
        <PerspectiveCamera makeDefault position={[0, 18, 34]} fov={32} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[18, 28, 16]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <directionalLight position={[-16, 10, -6]} intensity={0.35} />
        <Typewriter text={text} animateFrom={animateFrom} ripping={ripping} />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -5, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <shadowMaterial opacity={0.28} />
        </mesh>
        <OrbitControls
          enablePan={false}
          minDistance={22}
          maxDistance={60}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 4, 0]}
        />
      </Canvas>
    </div>
  );
}
