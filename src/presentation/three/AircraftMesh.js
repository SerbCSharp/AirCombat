import * as THREE from 'three';

export class AircraftMesh {
  build(units) {
    const group = new THREE.Group();

    units.forEach((u) => {
      const isFighter = u.type === 'FIGHTER';
      const mesh = new THREE.Mesh(
        isFighter ? new THREE.ConeGeometry(0.45, 1.3, 4) : new THREE.BoxGeometry(1, 0.45, 1.2),
        new THREE.MeshStandardMaterial({ color: u.team === 'RED' ? 0xff4d4d : 0x4da6ff })
      );
      if (isFighter) mesh.rotation.x = u.team === 'RED' ? Math.PI / 2 : -Math.PI / 2;
      mesh.position.set(u.x, 0.45, u.z);
      group.add(mesh);
    });

    return group;
  }
}