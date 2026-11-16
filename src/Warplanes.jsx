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
  const lightRefs = useRef([]); // Рефы для источников света

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
    // Обновляем значение напрямую без перерисовки React
    selectedIdRef.current = selectedIdRef.current === id ? null : id;
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
      const light = lightRefs.current[i];
      if (!mesh) return;

      const isSelected = selectedIdRef.current === item.id;
      const [targetX, targetY, baseZ] = targetsRef.current[i];

      // Если выбран — держим высоту baseZ + 3, иначе сажаем на baseZ
      const targetZ = isSelected ? baseZ + 3 : baseZ;

      // Плавное перемещение по X
      if (Math.abs(mesh.position.x - targetX) > 0.001) {
        mesh.position.x = THREE.MathUtils.damp(
          mesh.position.x,
          targetX,
          6,
          delta,
        );
      } else {
        mesh.position.x = targetX;
      }

      // Плавное перемещение по Y
      if (Math.abs(mesh.position.y - targetY) > 0.001) {
        mesh.position.y = THREE.MathUtils.damp(
          mesh.position.y,
          targetY,
          6,
          delta,
        );
      } else {
        mesh.position.y = targetY;
      }

      // Плавный подъем и посадка по Z
      if (Math.abs(mesh.position.z - targetZ) > 0.001) {
        // damp безопаснее lerp при скачках FPS
        mesh.position.z = THREE.MathUtils.damp(
          mesh.position.z,
          targetZ,
          8,
          delta,
        );
      } else {
        mesh.position.z = targetZ;
      }

      // Плавное включение и выключение света при взлете/посадке
      if (light) {
        const targetIntensity = isSelected ? 15 : 0; // 15 — яркость при взлете
        if (Math.abs(light.intensity - targetIntensity) > 0.01) {
          light.intensity = THREE.MathUtils.damp(
            light.intensity,
            targetIntensity,
            8,
            delta,
          );
        } else {
          light.intensity = targetIntensity;
        }
      }
    });
  });

  return (
    <group>
      {/* Невидимая плоскость для перехвата второго клика в плоскости XY.
          Если у вас уже есть меш земли/карты, перенесите onClick на него. */}
      <mesh position={[0, 0, 0]} onClick={handlePlaneClick}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {fighters.map((item, i) => (
        <mesh
          key={item.id}
          ref={(el) => (meshRefs.current[i] = el)}
          position={item.position}
          geometry={fighterGeometry}
          material={materials[item.color]}
          onClick={(e) => handleCubeClick(e, item.id)}
          // Меняем курсор при наведении для удобства
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          {/* Источник света привязан к центру меша. 
              Высота куба = 1, значит низ находится на -0.5 по Z.
              Ставим -0.55, чтобы свет не перекрывался геометрией самого куба. */}
          <pointLight
            ref={(el) => (lightRefs.current[i] = el)}
            position={[0, 0, -0.55]}
            color="#ffaa00"
            intensity={0}
            distance={6}
            decay={2}
          />
        </mesh>
      ))}
    </group>
  );
}
