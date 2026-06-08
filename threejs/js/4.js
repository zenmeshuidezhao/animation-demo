import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const canvas = document.querySelector('#canvas');

const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
}); 

const scene = new THREE.Scene();

const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
// camera.lookAt(mesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);

const tick = () => {
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;
    // camera.lookAt(mesh.position);

    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();