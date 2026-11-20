import { nodeToWorld } from '../utils/gridTo3dPosition';

export function PossibleMovesHighlight({ targets, onSelectTarget }) {
  return (
    <group>
      {targets.map((target) => {
        // Чуть приподнимаем маркер над доской (altitude = 0.05)
        const pos = nodeToWorld(target.x, target.y, 0.05);

        return (
          <mesh
            key={`${target.x}-${target.y}`}
            position={pos}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation(); // чтобы клик не провалился в доску
              onSelectTarget(target);
            }}
          >
            <circleGeometry args={[0.32, 24]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.75} />
          </mesh>
        );
      })}
    </group>
  );
}