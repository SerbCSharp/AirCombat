import * as THREE from "three";

export class StructuresMesh {
  constructor() {
    this.group = new THREE.Group();

    this.hqGeo = new THREE.PlaneGeometry(1.5, 1.5).rotateX(-Math.PI / 2);
    this.samGeo = new THREE.RingGeometry(0.45, 0.78, 24).rotateX(-Math.PI / 2);
this.aaArcGeo = new THREE.RingGeometry(0.45, 0.78, 16, 1, 0, Math.PI).rotateX(-Math.PI / 2);
    this.arrowGeo = new THREE.ConeGeometry(0.22, 0.45, 3).rotateX(Math.PI / 2);

    this.materials = {
      RED: new THREE.MeshBasicMaterial({
        color: 0xff5252,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      BLUE: new THREE.MeshBasicMaterial({
        color: 0x448aff,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      HQ: new THREE.MeshBasicMaterial({
        color: 0xffd740,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    };
  }

  build(structures) {
    this.group.clear();

    structures.forEach((s) => {
      const mesh = this._createMarker(s);
      mesh.position.set(s.worldPos.x, s.worldPos.y, s.worldPos.z);
      mesh.rotation.y = s.rotationY;
      this.group.add(mesh);
    });

    return this.group;
  }

  _createMarker({ type, team }) {
    if (type === "HQ") {
      return new THREE.Mesh(this.hqGeo, this.materials.HQ);
    }

    const mat = this.materials[team];

    if (type === "SAM") {
      return new THREE.Mesh(this.samGeo, mat);
    }

    // AA_GUN: полудуга + стрелка направления фронта
    const container = new THREE.Group();
    const arc = new THREE.Mesh(this.aaArcGeo, mat);
    const arrow = new THREE.Mesh(this.arrowGeo, mat);
    arrow.position.z = 0.55;
    container.add(arc, arrow);
    return container;
  }

  dispose() {
    this.hqGeo.dispose();
    this.samGeo.dispose();
    this.aaArcGeo.dispose();
    this.arrowGeo.dispose();
    Object.values(this.materials).forEach((m) => m.dispose());
    this.group.clear();
  }
}
