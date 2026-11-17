import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

let fighters = [
  { id: 1, position: [30, 18, 0.7], color: "red" },
  { id: 2, position: [30, 15, 0.7], color: "red" },
  { id: 3, position: [30, 12, 0.7], color: "red" },
  { id: 4, position: [33, 18, 0.7], color: "blue" },
  { id: 5, position: [33, 15, 0.7], color: "red" },
  { id: 6, position: [33, 12, 0.7], color: "red" },
];

export default function Warplanes() {
  const meshRefs = useRef([]);
  const selectedIdRef = useRef(null);
  const singleLightRef = useRef(null); // Один источник света на всю сцену
  const lastSelectedIdxRef = useRef(-1); // Индекс куба, над которым висит свет

  // Храним актуальные целевые координаты [x, y, z] для каждого куба в рефе,
  // чтобы менять их без ререндера компонента
  const targetsRef = useRef(fighters.map((f) => [...f.position]));

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

  const handleCubeClick = (e, id) => {
    e.stopPropagation();
    const isDeselecting = selectedIdRef.current === id;
    selectedIdRef.current = isDeselecting ? null : id;

    if (!isDeselecting) {
      // Запоминаем индекс куба, который только что выбрали
      lastSelectedIdxRef.current = fighters.findIndex((f) => f.id === id);
    }
  };

  // 2. Второй клик по поверхности (выбор точки назначения)
  const handlePlaneClick = (e) => {
    // Если ни один куб не выбран, ничего не делаем
    if (selectedIdRef.current === null) return;

    e.stopPropagation();

    // Находим индекс выбранного куба
    const selectedIndex = fighters.findIndex(
      (f) => f.id === selectedIdRef.current,
    );

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
    fighters.forEach((item, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      const isSelected = selectedIdRef.current === item.id;
      const [targetX, targetY, baseZ] = targetsRef.current[i];

      // Если выбран — держим высоту baseZ + 3, иначе сажаем на baseZ
      const targetZ = isSelected ? baseZ + 3 : baseZ;

      mesh.position.x = THREE.MathUtils.damp(
        mesh.position.x,
        targetX,
        6,
        delta,
      );
      mesh.position.y = THREE.MathUtils.damp(
        mesh.position.y,
        targetY,
        6,
        delta,
      );
      mesh.position.z = THREE.MathUtils.damp(
        mesh.position.z,
        targetZ,
        8,
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
          activeMesh.position.z - 0.55,
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
        color="#ffaa00"
        intensity={0}
        distance={6}
        decay={2}
      />

      <mesh position={[0, 0, 0.05]} onClick={handlePlaneClick}>
        <planeGeometry args={[75, 45]} />
        <meshStandardMaterial color={"gray"} transparent opacity={0.5} />
      </mesh>

      {fighters.map((item, i) => (
        <mesh
          key={item.id}
          ref={(el) => (meshRefs.current[i] = el)}
          position={item.position}
          geometry={fighterGeometry}
          material={materials[item.color]}
          onClick={(e) => handleCubeClick(e, item.id)}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        />
      ))}
    </group>
  );
}
