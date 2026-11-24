import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#98e5fe");

    this.camera = new THREE.PerspectiveCamera(
      45,
      innerWidth / innerHeight,
      0.1,
      1000,
    );
    this.camera.position.set(30, 40, 3);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(30, 40, 3);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5), light);

    addEventListener("resize", () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
  }

  add(obj) {
    this.scene.add(obj);
  }

  runAnimation() {
    const loop = () => {
      requestAnimationFrame(loop);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }
}
