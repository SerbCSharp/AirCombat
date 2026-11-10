import {
  DragControls,
  Sky,
  useTexture,
  OrbitControls,
} from "@react-three/drei";

export default function App() {
  const planeTexture = useTexture("./textures/plane.jpg");

  return (
    <>
      <OrbitControls makeDefault />

      <Sky sunPosition={[1, 2, 3]} />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <mesh rotation-z={-0.5 * Math.PI}>
        <planeGeometry args={[28.2, 48.6]} />
        <meshStandardMaterial map={planeTexture} />
      </mesh>

      <DragControls axisLock="z">
        <mesh position-z={0.7}>
          <boxGeometry />
          <meshStandardMaterial color={"red"} />
        </mesh>
      </DragControls>
      <DragControls axisLock="z">
        <mesh position={[2, 0, 0.7]}>
          <boxGeometry />
          <meshStandardMaterial color={"blue"} />
        </mesh>
      </DragControls>
    </>
  );
}
