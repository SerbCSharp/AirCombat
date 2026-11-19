import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANE_Z, TEAM_MATERIALS } from './warplanesData.js';

export function Warplane({
  spec,
  isSelected,
  orderRef,
  positionsRef,
  onSelect,
  onDestroyEnemy,
}) {
  const groupRef = useRef(null);
  const groundedZ = PLANE_Z + spec.scale * 0.5;

  // Регистрируем начальную позицию в общем реестре
  useEffect(() => {
    positionsRef.current[spec.id] = new THREE.Vector3(...spec.position);
    return () => {
      delete positionsRef.current[spec.id];
      document.body.style.cursor = 'auto';
    };
  }, [spec.id, spec.position, positionsRef]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const order = orderRef.current[spec.id];
    let finalTargetX = group.position.x;
    let finalTargetY = group.position.y;

    if (order?.type === 'move') {
      [finalTargetX, finalTargetY] = order.target;
    } else if (order?.type === 'attack') {
      const enemyPos = positionsRef.current[order.targetId];
      if (enemyPos) {
        finalTargetX = enemyPos.x;
        finalTargetY = enemyPos.y;

        // Проверка дистанции для сбития врага
        const dist = Math.hypot(
          finalTargetX - group.position.x,
          finalTargetY - group.position.y
        );
        if (dist < 1.2) {
          onDestroyEnemy(spec.id, order.targetId);
          // После сбития остаёмся на месте врага
          orderRef.current[spec.id] = {
            type: 'move',
            target: [finalTargetX, finalTargetY],
          };
        }
      } else {
        // Если цель уже уничтожена другим самолётом — приземляемся
        orderRef.current[spec.id] = {
          type: 'move',
          target: [group.position.x, group.position.y],
        };
      }
    }

    const isArrived =
      Math.abs(finalTargetX - group.position.x) <= 0.2 &&
      Math.abs(finalTargetY - group.position.y) <= 0.2;

    if (!isSelected && isArrived && Math.abs(group.position.z - groundedZ) < 0.001) {
      return;
    }

    const targetZ = isSelected || !isArrived ? groundedZ + 3 : groundedZ;
    const turnRadius = 0.8;
    const isMovingX = Math.abs(finalTargetX - group.position.x) > turnRadius;

    const currentTargetX = finalTargetX;
    const currentTargetY = isMovingX ? group.position.y : finalTargetY;

    const dx = currentTargetX - group.position.x;
    const dy = currentTargetY - group.position.y;

    const maxTilt = 0.45;
    const targetTiltY = THREE.MathUtils.clamp(dx * 0.08, -maxTilt, maxTilt);
    const targetTiltX = THREE.MathUtils.clamp(-dy * 0.08, -maxTilt, maxTilt);

    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetTiltY, 8, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetTiltX, 8, delta);

    group.position.x = THREE.MathUtils.damp(group.position.x, currentTargetX, 4, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, currentTargetY, 4, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 3, delta);

    // Обновляем координаты в общем реестре для преследования
    positionsRef.current[spec.id]?.copy(group.position);
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(spec);
  };

  return (
    <group
      ref={groupRef}
      position={spec.position}
      scale={spec.scale}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Замените этот mesh на ваши <HeavyPlaneModel /> и <LightPlaneModel /> */}
      <mesh material={TEAM_MATERIALS[spec.color]}>
        <boxGeometry args={spec.modelType === 'heavy' ? [1.2, 1.2, 0.8] : [1, 1, 1]} />
      </mesh>
    </group>
  );
}