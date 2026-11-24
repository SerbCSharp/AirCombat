import * as THREE from 'three';

export class BoardMesh {
  build(cells) {
    const group = new THREE.Group();

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(26, 0.2, 46),
      new THREE.MeshStandardMaterial({ color: '#57A639' })
    );
    ground.position.y = -0.15;
    group.add(ground);

    cells.forEach((c) => {
      const isBase = c.type === 'AIRFIELD';
      const color = isBase ? (c.team === 'RED' ? 0xd9383a : 0x2b6cb0) : 0xdcdcdc;
      const node = new THREE.Mesh(
        new THREE.CylinderGeometry(isBase ? 0.55 : 0.15, isBase ? 0.55 : 0.15, 0.1, 16),
        new THREE.MeshStandardMaterial({ color })
      );
      node.position.set(c.x, 0, c.z);
      group.add(node);
    });

    return group;
  }
}