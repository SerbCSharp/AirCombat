import { Grid } from "@react-three/drei";

export default function GameBoard() {
  return (
    <>
      <Grid
        rotation-x={0.5 * Math.PI}
        args={[76, 45]}
        cellSize={1} // Размер маленькой клетки = 1
        cellThickness={1} // Толщина линий маленькой клетки
        cellColor="grey" // Цвет линий
        sectionSize={3} // Размер крупной секции (каждые 5 клеток)
        sectionThickness={1.5} // Толщина линий секции
        sectionColor="black" // Цвет линий секции
        side={2}
      />
      <mesh position={[31.5, 15, 0.1]} rotation-z={-0.5 * Math.PI}>
        <planeGeometry args={[9, 6]} />
        <meshStandardMaterial color={"#e63946"} transparent opacity={0.5} />
      </mesh>
      <mesh position={[32.75, -13.5, 0.1]} rotation-z={-0.5 * Math.PI}>
        <planeGeometry args={[12, 8.5]} />
        <meshStandardMaterial color={"#e63946"} transparent opacity={0.5} />
      </mesh>

      <mesh position={[-31.5, -15, 0.1]} rotation-z={-0.5 * Math.PI}>
        <planeGeometry args={[9, 6]} />
        <meshStandardMaterial color={"#3a86ff"} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-32.75, 13.5, 0.1]} rotation-z={-0.5 * Math.PI}>
        <planeGeometry args={[12, 8.5]} />
        <meshStandardMaterial color={"#3a86ff"} transparent opacity={0.5} />
      </mesh>
    </>
  );
}
