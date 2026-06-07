import * as THREE from 'three';
import gsap from 'gsap';

const canvas = document.querySelector('#canvas');

const scene =  new THREE.Scene();

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas
});

renderer.setSize(sizes.width, sizes.height);

gsap.to(mesh.position, {
    duration: 1,
    delay: 1,
    ease: 'power2.inOut',
    x: 2,
    repeat: -1,
    yoyo: true
});


const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // 更新动画
    // mesh.position.x = Math.cos(elapsedTime);
    // mesh.position.y =  Math.sin(elapsedTime);

    // 渲染
    renderer.render(scene, camera);

    // 继续下一帧
    window.requestAnimationFrame(tick);
};

tick();
