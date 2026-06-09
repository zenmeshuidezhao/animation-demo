import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import gsap from 'gsap';

const canvas = document.querySelector('#canvas');
const gui = new GUI();

const debugObj = {};

const scene = new THREE.Scene();

debugObj.color = 0xff0000;
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: debugObj.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('position y');
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');
gui.addColor(debugObj, 'color')
    .onChange(() => {
        material.color.set(debugObj.color);
    });

debugObj.spin = () => {
    gsap.to(mesh.rotation, {
        duration: 1,
        x: mesh.rotation.x + 2 * Math.PI,
        y: mesh.rotation.y + 2 * Math.PI,
        z: mesh.rotation.z + 2 * Math.PI,
    })
};

gui.add(debugObj, 'spin');

debugObj.subdivision = 2;
gui.add(debugObj, 'subdivision').min(1).max(20).step(1).onChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debugObj.subdivision, debugObj.subdivision, debugObj.subdivision);
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(mesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
