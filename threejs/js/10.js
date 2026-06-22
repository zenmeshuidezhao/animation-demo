import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ======================
// 基础设置
// ======================
const canvas = document.querySelector('#canvas')

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// ======================
// 相机
// ======================
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(4, 4, 6)
scene.add(camera)

// ======================
// 控制器（鼠标旋转）
// ======================
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// ======================
// 光照（matcap其实不需要，但更稳）
// ======================
const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

// ======================
// 纹理
// ======================
const textureLoader = new THREE.TextureLoader()
const matcap = textureLoader.load('/static/textures/matcaps/1.png')

// ======================
// 文字
// ======================
const fontLoader = new FontLoader()

let textMesh = null

fontLoader.load('/static/fonts/helvetiker_regular.typeface.json', (font) => {

  const textGeometry = new TextGeometry('HELLO WORLD', {
    font,
    size: 0.6,
    depth: 0.2,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3
  })

  textGeometry.center()

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap
  })

  textMesh = new THREE.Mesh(textGeometry, textMaterial)
  scene.add(textMesh)
})

// ======================
// 🍩 1000 Donuts（InstancedMesh 优化版）
// ======================
const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 16, 32)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap })

const COUNT = 1000

const donuts = new THREE.InstancedMesh(
  donutGeometry,
  donutMaterial,
  COUNT
)

const dummy = new THREE.Object3D()

// 存储每个 donut 的动画参数
const donutData = []

for (let i = 0; i < COUNT; i++) {

  dummy.position.set(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 12
  )

  dummy.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    0
  )

  const scale = Math.random() * 0.4 + 0.1
  dummy.scale.set(scale, scale, scale)

  dummy.updateMatrix()
  donuts.setMatrixAt(i, dummy.matrix)

  donutData.push({
    speed: Math.random() * 0.5 + 0.2,
    offset: Math.random() * Math.PI * 2
  })
}

scene.add(donuts)

// ======================
// 鼠标交互
// ======================
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
})

// ======================
// 动画
// ======================
const clock = new THREE.Clock()

function animate() {

  const elapsed = clock.getElapsedTime()

  controls.update()

  // 文字轻微漂浮
  if (textMesh) {
    textMesh.position.y = Math.sin(elapsed * 0.5) * 0.1
    textMesh.rotation.y = elapsed * 0.1
  }

  // donuts 动画更新（核心）
  for (let i = 0; i < COUNT; i++) {

    donuts.getMatrixAt(i, dummy.matrix)
    dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale)

    const data = donutData[i]

    dummy.position.y += Math.sin(elapsed * data.speed + data.offset) * 0.002
    dummy.rotation.x += 0.002
    dummy.rotation.y += 0.003

    // 鼠标轻微影响整体漂移
    dummy.position.x += mouse.x * 0.0005
    dummy.position.y += mouse.y * 0.0005

    dummy.updateMatrix()
    donuts.setMatrixAt(i, dummy.matrix)
  }

  donuts.instanceMatrix.needsUpdate = true

  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

animate()

// ======================
// resize
// ======================
window.addEventListener('resize', () => {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})