import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

const fighters = [
  { id: 1, position: [30, 18, 0.7], color: "red" },
  { id: 2, position: [30, 15, 0.7], color: "red" },
  { id: 3, position: [30, 12, 0.7], color: "red" },
  { id: 4, position: [33, 18, 0.7], color: "blue" },
  { id: 5, position: [33, 15, 0.7], color: "red" },
  { id: 6, position: [33, 12, 0.7], color: "red" },
];

export default function Warplanes() {
  const meshRefs = useRef([]);

  const { fighterGeometry, materials } = useMemo(() => {
    return {
      fighterGeometry: new THREE.BoxGeometry(1, 1, 1),
      materials: {
        red: new THREE.MeshStandardMaterial({ color: "red" }),
        blue: new THREE.MeshStandardMaterial({ color: "blue" }),
      },
    };
  }, []);

  useEffect(() => {
    return () => {
      fighterGeometry.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    };
  }, [fighterGeometry, materials]);

  return (
    <group>
      {fighters.map((item, i) => (
        <mesh
          key={item.id}
          ref={(el) => (meshRefs.current[i] = el)}
          position={item.position}
          geometry={fighterGeometry}
          material={materials[item.color]}
        />
      ))}
    </group>
  );
}
