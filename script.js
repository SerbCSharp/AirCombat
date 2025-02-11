import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene();

const texture = new THREE.TextureLoader().load( '/textures/plane.jpg' );
texture.colorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 40);
camera.lookAt(scene.position);

const axes = new THREE.AxesHelper(5);
scene.add(axes);

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 15)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.right = 25;
directionalLight.shadow.camera.bottom = - 15;
directionalLight.shadow.camera.left = - 25;
scene.add(directionalLight );

const planeGeometry = new THREE.PlaneGeometry(28.2,48.6);
const planeMaterial = new THREE.MeshStandardMaterial( { map: texture } );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.set(0, 0, 0);
plane.rotation.z = -0.5*Math.PI;
plane.receiveShadow = true
scene.add( plane );

const cubeGeometry = new THREE.BoxGeometry(2, 1, 0.5);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 'blue' });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(1, 1, 0.6);
cube.castShadow = true
scene.add(cube);

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    cube.position.z = Math.sin(elapsedTime * 7) * 0.5 + 0.8

    orbitControls.update();
    renderer.render( scene, camera );
    window.requestAnimationFrame(tick)
}

tick();