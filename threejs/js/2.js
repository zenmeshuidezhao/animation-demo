import * as THREE from 'three';

const canvas = document.querySelector('#canvas');

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const group = new THREE.Group();
group.position.y = -0.5;
group.scale.y = 0.5;
group.rotation.y = Math.PI / 4;

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0xff0000
    })
);

cube1.position.x = -2;

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0x00ff00
    }),
);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0x0000ff
    })
);

cube3.position.x = 2;

group.add(cube1, cube2, cube3);
scene.add(group);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.lookAt(group.position);

scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas
});

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
