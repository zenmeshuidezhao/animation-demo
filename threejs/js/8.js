import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#canvas');

const scene = new THREE.Scene();

// const image = new Image();
// const texture = new THREE.CanvasTexture(image);

// image.onload = () => {
//     texture.needsUpdate = true;
// };

// image.src = '../static/textures/door/color.jpg';

// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(
//     '../static/textures/door/color.jpg',
//     () => {
//         console.log('texture loaded');
//     },
//     () => {
//         console.log('texture loading')
//     },
//     () => {
//         console.log('texture error');
//     }
// );

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log('loading started');
};
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`${url} ${itemsLoaded} / ${itemsTotal}`);
};
loadingManager.onLoad = () => {
    console.log('loading complete');
};
loadingManager.onError = (url) => {
    console.log(`error loading ${url}`);
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('../static/textures/door/color.jpg');

colorTexture.repeat.x = 2;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);


const tick = () => {
    controls.update();

    // Update
    mesh.rotation.y += 0.01;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
