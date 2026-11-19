import { useState, useRef, useCallback } from "react";
import { INITIAL_AIRCRAFT } from "./warplanesData.js";
import { Warplane } from "./Warplane.jsx";

export default function Warplanes() {
  const [aliveAircraft, setAliveAircraft] = useState(INITIAL_AIRCRAFT);
  const [selectedId, setSelectedId] = useState(null);

  const ordersRef = useRef({});
  const positionsRef = useRef({});

  const handleAircraftClick = useCallback(
    (clicked) => {
      if (selectedId === null) {
        setSelectedId(clicked.id);
        return;
      }

      if (selectedId === clicked.id) {
        setSelectedId(null);
        return;
      }

      const selectedPlane = aliveAircraft.find((a) => a.id === selectedId);
      if (!selectedPlane) {
        setSelectedId(clicked.id);
        return;
      }

      if (selectedPlane.color === clicked.color) {
        // Клик по союзнику — переключаем выделение
        setSelectedId(clicked.id);
      } else {
        // Клик по врагу — отдаём приказ атаковать
        ordersRef.current[selectedPlane.id] = {
          type: "attack",
          targetId: clicked.id,
        };
        setSelectedId(null);
      }
    },
    [selectedId, aliveAircraft],
  );

  const handlePlaneClick = (e) => {
    if (selectedId === null) return;
    e.stopPropagation();

    ordersRef.current[selectedId] = {
      type: "move",
      target: [e.point.x, e.point.y],
    };
    setSelectedId(null);
  };

  const handleDestroyEnemy = useCallback((_attackerId, enemyId) => {
    setAliveAircraft((prev) => prev.filter((plane) => plane.id !== enemyId));
    setSelectedId((prev) => (prev === enemyId ? null : prev));
  }, []);

  return (
    <group>
      <mesh position={[0, 0, 0.05]} onClick={handlePlaneClick}>
        <planeGeometry args={[76, 45]} />
        <meshStandardMaterial color="gray" transparent opacity={0.5} />
      </mesh>

      {aliveAircraft.map((spec) => (
        <Warplane
          key={spec.id}
          spec={spec}
          isSelected={selectedId === spec.id}
          orderRef={ordersRef}
          positionsRef={positionsRef}
          onSelect={handleAircraftClick}
          onDestroyEnemy={handleDestroyEnemy}
        />
      ))}
    </group>
  );
}
