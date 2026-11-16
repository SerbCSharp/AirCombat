import { Sky, OrbitControls } from "@react-three/drei";
import Warplanes from "./Warplanes.jsx";
import GameBoard from "./GameBoard.jsx";

export default function App() {
  return (
    <>
      <OrbitControls makeDefault />

      <Sky sunPosition={[1, 2, 3]} />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <GameBoard />
      <Warplanes />
    </>
  );
}
