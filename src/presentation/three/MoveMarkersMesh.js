import * as THREE from "three";

export class MoveMarkersMesh {
  constructor() {
    this.group = new THREE.Group();

    this.ringGeo = new THREE.RingGeometry(0.45, 0.72, 24).rotateX(-Math.PI / 2);
    this.arrowGeo = new THREE.ConeGeometry(0.28, 0.55, 3).rotateX(Math.PI / 2);

    this.moveMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e676,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });

    this.turnMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd54f,
      transparent: true,
      opacity: 0.9,
    });
  }

  sync(markers) {
    this.group.clear();

    markers.forEach((m) => {
      const markerObj = m.isTurnInPlace
        ? this._createTurnArrow()
        : this._createCellMarker();

      markerObj.position.set(m.worldPos.x, m.worldPos.y, m.worldPos.z);
      markerObj.rotation.y = m.rotationY;
      markerObj.userData.move = m.move;

      this.group.add(markerObj);
    });

    return this.group;
  }

  _createCellMarker() {
    const container = new THREE.Group();

    const ring = new THREE.Mesh(this.ringGeo, this.moveMaterial);
    const arrow = new THREE.Mesh(this.arrowGeo, this.moveMaterial);
    arrow.position.z = 0.25;

    container.add(ring, arrow);
    return container;
  }

  _createTurnArrow() {
    return new THREE.Mesh(this.arrowGeo, this.turnMaterial);
  }

  dispose() {
    this.ringGeo.dispose();
    this.arrowGeo.dispose();
    this.moveMaterial.dispose();
    this.turnMaterial.dispose();
    this.group.clear();
  }
}
