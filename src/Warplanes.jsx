import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PLANE_Z = 0.05;

const aircraft = [
  { id: 1, position: [30, 18, 0.7], color: "red", scale: 1.5 },
  { id: 2, position: [30, 15, 0.7], color: "red", scale: 1.5 },
  { id: 3, position: [30, 12, 0.7], color: "red", scale: 1.5 },
  { id: 4, position: [33, 18, 0.7], color: "red", scale: 1.5 },
  { id: 5, position: [33, 15, 0.7], color: "red", scale: 1.5 },
  { id: 6, position: [33, 12, 0.7], color: "red", scale: 1.5 },
  { id: 7, position: [33, -9, 0.7], color: "red", scale: 1 },
  { id: 8, position: [30, -12, 0.7], color: "red", scale: 1 },
  { id: 9, position: [30, -15, 0.7], color: "red", scale: 1 },
  { id: 10, position: [30, -18, 0.7], color: "red", scale: 1 },
  { id: 11, position: [33, -12, 0.7], color: "red", scale: 1 },
  { id: 12, position: [33, -15, 0.7], color: "red", scale: 1 },
  { id: 13, position: [33, -18, 0.7], color: "red", scale: 1 },
  { id: 14, position: [36, -12, 0.7], color: "red", scale: 1 },
  { id: 15, position: [36, -15, 0.7], color: "red", scale: 1 },
  { id: 16, position: [36, -18, 0.7], color: "red", scale: 1 },
  { id: 17, position: [-30, -18, 0.7], color: "blue", scale: 1.5 },
  { id: 18, position: [-30, -15, 0.7], color: "blue", scale: 1.5 },
  { id: 19, position: [-30, -12, 0.7], color: "blue", scale: 1.5 },
  { id: 20, position: [-33, -18, 0.7], color: "blue", scale: 1.5 },
  { id: 21, position: [-33, -15, 0.7], color: "blue", scale: 1.5 },
  { id: 22, position: [-33, -12, 0.7], color: "blue", scale: 1.5 },
  { id: 23, position: [-33, 9, 0.7], color: "blue", scale: 1 },
  { id: 24, position: [-30, 12, 0.7], color: "blue", scale: 1 },
  { id: 25, position: [-30, 15, 0.7], color: "blue", scale: 1 },
  { id: 26, position: [-30, 18, 0.7], color: "blue", scale: 1 },
  { id: 27, position: [-33, 12, 0.7], color: "blue", scale: 1 },
  { id: 28, position: [-33, 15, 0.7], color: "blue", scale: 1 },
  { id: 29, position: [-33, 18, 0.7], color: "blue", scale: 1 },
  { id: 30, position: [-36, 12, 0.7], color: "blue", scale: 1 },
  { id: 31, position: [-36, 15, 0.7], color: "blue", scale: 1 },
  { id: 32, position: [-36, 18, 0.7], color: "blue", scale: 1 },
];

export default function Warplanes() {
  const meshRefs = useRef([]);
  const selectedIdRef = useRef(null);
  const singleLightRef = useRef(null); // Один источник света на всю сцену
  const lastSelectedIdxRef = useRef(-1); // Индекс куба, над которым висит свет

  // Храним актуальные целевые координаты [x, y, z] для каждого куба в рефе,
  // чтобы менять их без ререндера компонента
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
    // Если ни один куб не выбран, ничего не делаем
    if (selectedIdRef.current === null) return;
    e.stopPropagation();

    // Находим индекс выбранного куба
    const selectedIndex = lastSelectedIdxRef.current;

    if (selectedIndex !== -1) {
      // e.point содержит точные мировые координаты клика по плоскости
      targetsRef.current[selectedIndex][0] = e.point.x;
      targetsRef.current[selectedIndex][1] = e.point.y;
      // Снимаем выделение, чтобы куб начал посадку в новой точке
      selectedIdRef.current = null;
    }
  };

  // Анимация подъема и опускания каждый кадр
  useFrame((state, delta) => {
    aircraft.forEach((item, i) => {
      const mesh = meshRefs.current[i];

      if (!mesh) return;

      const isSelected = selectedIdRef.current === item.id;
      // 1. Берем конечные цели из рефа
      const [finalTargetX, finalTargetY] = targetsRef.current[i];

      const groundedZ = PLANE_Z + item.scale * 0.5;
      // Самолет остается в воздухе, пока выбран ИЛИ пока не долетел до конца обоих катетов
      const isArrived =
        Math.abs(finalTargetX - mesh.position.x) <= 0.2 &&
        Math.abs(finalTargetY - mesh.position.y) <= 0.2;

      const targetZ = isSelected || !isArrived ? groundedZ + 3 : groundedZ;

      // 2. Определяем, летим ли мы еще по оси X (порог точности 0.2 единицы)
      // Порог переключения (радиус скругления угла)
      // 0.05 — резкий прямой угол с почти полной остановкой
      // 0.8  — мягкий, плавный поворот без потери скорости
      // 2.0  — очень широкая дуга
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
    // Управляем единственным источником света
    const light = singleLightRef.current;
    const activeIdx = lastSelectedIdxRef.current;
    if (light && activeIdx !== -1) {
      const activeMesh = meshRefs.current[activeIdx];
      if (activeMesh) {
        // Свет всегда следует за последним выбранным кубом (даже во время его посадки)
        light.position.set(
          activeMesh.position.x,
          activeMesh.position.y,
          activeMesh.position.z - (aircraft[activeIdx].scale * 0.5 + 0.1),
        );
      }

      // Если куб всё ещё выбран — светим на 15, если уже садится — плавно гасим до 0
      const targetIntensity = selectedIdRef.current !== null ? 15 : 0;
      light.intensity = THREE.MathUtils.damp(
        light.intensity,
        targetIntensity,
        8,
        delta,
      );
    }
  });

  return (
    <group>
      {/* Всего один pointLight на весь компонент */}
      <pointLight
        ref={singleLightRef}
        color="#ffffff"
        intensity={0}
        distance={6}
        decay={2}
      />

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
