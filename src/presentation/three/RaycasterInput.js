import * as THREE from "three";

export class RaycasterInput {
  constructor({
    camera,
    domElement,
    aircraftTargets,
    markerTargets,
    onAircraftClick,
    onMoveMarkerClick,
  }) {
    this.camera = camera;
    this.domElement = domElement;
    this.aircraftTargets = aircraftTargets;
    this.markerTargets = markerTargets;
    this.onAircraftClick = onAircraftClick;
    this.onMoveMarkerClick = onMoveMarkerClick;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.downPos = { x: 0, y: 0 };

    this.domElement.addEventListener("pointerdown", this._onPointerDown);
    this.domElement.addEventListener("pointerup", this._onPointerUp);
  }

  _onPointerDown = (e) => {
    this.downPos = { x: e.clientX, y: e.clientY };
  };

  _onPointerUp = (e) => {
    const moved = Math.hypot(
      e.clientX - this.downPos.x,
      e.clientY - this.downPos.y,
    );
    if (moved > 5) return;

    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    // 1. Сначала проверяем клик по маркерам хода (если они сейчас показаны)
    const markerHits = this.raycaster.intersectObjects(this.markerTargets, true);
    if (markerHits.length > 0) {
      const move = this._findUserData(markerHits[0].object, "move");
      if (move) {
        this.onMoveMarkerClick?.(move);
        return;
      }
    }

    // 2. Затем проверяем клик по самолётам
    const aircraftHits = this.raycaster.intersectObjects(
      this.aircraftTargets,
      true,
    );
    if (aircraftHits.length > 0) {
      const unitId = this._findUserData(aircraftHits[0].object, "id");
      if (unitId) {
        this.onAircraftClick?.(unitId);
      }
    }
  };

  _findUserData(obj, key) {
    let curr = obj;
    while (curr) {
      if (curr.userData?.[key] !== undefined) return curr.userData[key];
      curr = curr.parent;
    }
    return null;
  }

  dispose() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown);
    this.domElement.removeEventListener("pointerup", this._onPointerUp);
  }
}

