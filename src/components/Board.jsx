import { useTexture } from "@react-three/drei";

export function Board() {
  const texture = useTexture("/plane.jpg");
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[13.8, 23.6]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
