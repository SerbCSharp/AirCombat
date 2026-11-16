import { useMemo } from "react";
import * as THREE from "three";

export default function FlatStar({ outerRadius = 9.2, innerRadius = 5.2 }) {
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 4; // Количество лучей
    const totalVertices = points * 2;

    for (let i = 0; i < totalVertices; i++) {
      // Чередуем внешний и внутренний радиусы
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      // Вычисляем угол для каждой вершины
      const angle = (i * Math.PI) / points;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();
    return shape;
  }, [outerRadius, innerRadius]);

  return (
    <mesh>
      <shapeGeometry args={[starShape]} />
      <meshStandardMaterial
        color="#00ff88"
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </mesh>
  );
}
