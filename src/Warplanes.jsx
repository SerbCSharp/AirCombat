import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PLANE_Z = 0.05;

const redSpecs = [
  // Крупные (scale: 1.5)
  ...[
    [30, 18],
    [30, 15],
    [30, 12],
    [33, 18],
    [33, 15],
    [33, 12],
  ].map((p) => ({ p, scale: 1.5 })),
  // Малые (scale: 1)
  ...[
    [33, -9],
    [30, -12],
    [30, -15],
    [30, -18],
    [33, -12],
    [33, -15],
    [33, -18],
    [36, -12],
    [36, -15],
    [36, -18],
  ].map((p) => ({ p, scale: 1 })),
];

const aircraft = [
  ...redSpecs.map(({ p: [x, y], scale }, i) => ({
    id: i + 1,
    position: [x, y, PLANE_Z + scale * 0.5],
    color: "red",
    scale,
  })),
  ...redSpecs.map(({ p: [x, y], scale }, i) => ({
    id: i + 17,
    position: [-x, -y, PLANE_Z + scale * 0.5], // Зеркалим красных
    color: "blue",
    scale,
  })),
];

export default function Warplanes() {
  const meshRefs = useRef([]);
  const selectedIdRef = useRef(null);
  const lastSelectedIdxRef = useRef(-1);

  const targetsRef = useRef(aircraft.map((f) => [...f.position]));

  const { fighterGeometry, materials } = useMemo(() => {
    return {
      fighterGeometry: new THREE.BoxGeometry(1, 1, 1),
      materials: {
        red: new THREE.MeshStandardMaterial({ color: "#e63946" }),
        blue: new THREE.MeshStandardMaterial({ color: "#3a86ff" }),
      },
    };
  }, []);

  useEffect(() => {
    return () => {
      fighterGeometry.dispose();
      Object.values(materials).forEach((material) => material.dispose());
      document.body.style.cursor = "auto"; // Гарантированный сброс курсора
    };
  }, [fighterGeometry, materials]);

  const handleCubeClick = (e, id) => {
    e.stopPropagation();
    const isDeselecting = selectedIdRef.current === id;
    selectedIdRef.current = isDeselecting ? null : id;

    if (!isDeselecting) {
      // Запоминаем индекс куба, который только что выбрали
      lastSelectedIdxRef.current = aircraft.findIndex((f) => f.id === id);
    }
  };

  // 2. Второй клик по поверхности (выбор точки назначения)
  const handlePlaneClick = (e) => {
    if (selectedIdRef.current === null) return;
    e.stopPropagation();

    const selectedIndex = lastSelectedIdxRef.current;

    if (selectedIndex !== -1) {
      // e.point содержит точные мировые координаты клика по плоскости
      targetsRef.current[selectedIndex][0] = e.point.x;
      targetsRef.current[selectedIndex][1] = e.point.y;
      // Снимаем выделение, чтобы куб начал посадку в новой точке
      selectedIdRef.current = null;
    }
  };

  useFrame((state, delta) => {
    aircraft.forEach((item, i) => {
      const mesh = meshRefs.current[i];

      if (!mesh) return;

      const isSelected = selectedIdRef.current === item.id;
      const [finalTargetX, finalTargetY] = targetsRef.current[i];

      const groundedZ = PLANE_Z + item.scale * 0.5;
      const isArrived =
        Math.abs(finalTargetX - mesh.position.x) <= 0.2 &&
        Math.abs(finalTargetY - mesh.position.y) <= 0.2;

      if (
        !isSelected &&
        isArrived &&
        Math.abs(mesh.position.z - groundedZ) < 0.001
      ) {
        return;
      }

      const targetZ = isSelected || !isArrived ? groundedZ + 3 : groundedZ;

      const turnRadius = 0.8;
      const isMovingX = Math.abs(finalTargetX - mesh.position.x) > turnRadius;

      // 3. Если летим по X — цель по Y временно замораживаем на текущей позиции
      const currentTargetX = finalTargetX;
      const currentTargetY = isMovingX ? mesh.position.y : finalTargetY;

      // 4. Вычисляем оставшееся расстояние до ТЕКУЩЕЙ цели (по катетам)
      const dx = currentTargetX - mesh.position.x;
      const dy = currentTargetY - mesh.position.y;

      // 5. Рассчитываем наклон (теперь самолет будет крениться строго в сторону активного катета)
      const maxTilt = 0.45;
      const targetTiltY = THREE.MathUtils.clamp(dx * 0.08, -maxTilt, maxTilt);
      const targetTiltX = THREE.MathUtils.clamp(-dy * 0.08, -maxTilt, maxTilt);

      // 6. Применяем плавное движение и наклон
      mesh.rotation.y = THREE.MathUtils.damp(
        mesh.rotation.y,
        targetTiltY,
        8,
        delta,
      );
      mesh.rotation.x = THREE.MathUtils.damp(
        mesh.rotation.x,
        targetTiltX,
        8,
        delta,
      );

      mesh.position.x = THREE.MathUtils.damp(
        mesh.position.x,
        currentTargetX,
        4,
        delta,
      );
      mesh.position.y = THREE.MathUtils.damp(
        mesh.position.y,
        currentTargetY,
        4,
        delta,
      );
      mesh.position.z = THREE.MathUtils.damp(
        mesh.position.z,
        targetZ,
        3,
        delta,
      );
    });
  });

  return (
    <group>
      <mesh position={[0, 0, 0.05]} onClick={handlePlaneClick}>
        <planeGeometry args={[76, 45]} />
        <meshStandardMaterial color={"gray"} transparent opacity={0.5} />
      </mesh>

      {aircraft.map((item, i) => (
        <mesh
          key={item.id}
          ref={(el) => (meshRefs.current[i] = el)}
          position={item.position}
          geometry={fighterGeometry}
          scale={item.scale}
          material={materials[item.color]}
          onClick={(e) => handleCubeClick(e, item.id)}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        />
      ))}
    </group>
  );
}
