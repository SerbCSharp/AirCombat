import { useState, useMemo } from "react";
import { OrbitControls } from "@react-three/drei";
import { initialAircraftPosition } from "./core/initialAircraftPosition";
import { Board } from "./components/Board";
import { Aircraft } from "./components/Aircraft";
import { getAvailableTargets } from "./core/movement";
import { PossibleMovesHighlight } from "./components/PossibleMovesHighlight";

const CAM_POS = [0.1, 17, 0];

export default function App() {
  const [units, setUnits] = useState(initialAircraftPosition);
  const [selectedId, setSelectedId] = useState(null);
  const [moveState, setMoveState] = useState(null); // { target, optionIndex }

  // Находим выбранный самолет
  const selectedUnit = useMemo(
    () => units.find((u) => u.id === selectedId) || null,
    [units, selectedId],
  );

  // Считаем доступные точки хода только при смене выбранного самолета
  const availableTargets = useMemo(
    () => getAvailableTargets(selectedUnit, units),
    [selectedUnit, units],
  );

  // Обработка клика по зеленому маркеру хода
  function handleMove(target) {
    if (!selectedUnit) return;
    // Берем направление из первого доступного маршрута в эту клетку
    const finalDir = target.options[0].dir;

    setUnits((prev) =>
      prev.map((u) =>
        u.id === selectedUnit.id
          ? { ...u, x: target.x, y: target.y, dir: finalDir }
          : u,
      ),
    );
    setSelectedId(null); // снимаем выделение после хода
  }

  return (
    <>
      <OrbitControls target={[0, 0, 0]} />
      <directionalLight position={[1, 5, 1]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <axesHelper args={[3]} />
      <Board />
      {units.map((u) => (
        <Aircraft
          key={u.id}
          unit={u}
          isSelected={u.id === selectedId}
          onSelect={setSelectedId}
        />
      ))}
      <PossibleMovesHighlight targets={availableTargets} onSelectTarget={handleMove} />
    </>
  );
}
