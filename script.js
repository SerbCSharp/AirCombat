import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene();

const texture = new THREE.TextureLoader().load( '/textures/plane.jpg' );
texture.colorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 40;
camera.lookAt(scene.position);

const axes = new THREE.AxesHelper(5);
scene.add(axes);

const spotLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add(spotLight );

const planeGeometry = new THREE.PlaneGeometry(28.2,48.6);
const planeMaterial = new THREE.MeshBasicMaterial( { map: texture } );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.x = 0
plane.position.y = 0;
plane.position.z = 0
plane.rotation.z = -0.5*Math.PI;
scene.add( plane );

const cubeGeometry = new THREE.BoxGeometry(2,1,1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 1;
cube.position.x = 1;
cube.position.z = 0.6;
scene.add(cube);

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize( window.innerWidth, window.innerHeight );

new OrbitControls(camera, canvas);

const tick = () => {
    renderer.render( scene, camera );
    window.requestAnimationFrame(tick)
}

tick();