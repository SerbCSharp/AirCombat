import { nodeToWorld, dirToRotation } from "../utils/gridTo3dPosition";
import { FIGHTER_GEOMETRY, BOMBER_GEOMETRY } from "../utils/aircraftGeometries";

export function Aircraft({ unit, isSelected, onSelect }) {
  const position = nodeToWorld(unit.x, unit.y);
  const rotationY = dirToRotation(unit.dir);

  const color = unit.team === "yellow" ? "#dcbb26" : "#2563eb";
  const geometry = unit.type === "fighter" ? FIGHTER_GEOMETRY : BOMBER_GEOMETRY;

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(unit.id);
      }}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.05} />
      </mesh>
      {/* Желтое кольцо выделения под активным самолетом */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.48, 32]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      )}
    </group>
  );
}
