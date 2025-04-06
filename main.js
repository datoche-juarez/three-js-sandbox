import * as THREE from "https://esm.sh/three@0.158.0";

// === Scene, Camera, Renderer ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x93adac); // Dark background
document.body.appendChild(renderer.domElement);

// === Raycasting Setup ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isHovered = false;

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// === Load Logo Texture ===
const loader = new THREE.TextureLoader();
const texture = loader.load("DajLogoBlackAndWhite.png", () => {
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
});

// === Create Cube ===
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, new Array(6).fill(material));
scene.add(cube);

// === Animate ===
function animate() {
  requestAnimationFrame(animate);

  // Hover detection
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(cube);
  isHovered = intersects.length > 0;
  document.body.style.cursor = isHovered ? "pointer" : "default";

  // Smooth scaling
  const targetScale = isHovered ? 1.2 : 1;
  const currentScale = cube.scale.x;
  const scaleSpeed = 0.1;
  const newScale = THREE.MathUtils.lerp(currentScale, targetScale, scaleSpeed);
  cube.scale.set(newScale, newScale, newScale);

  // Rotation
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

// === Resize handling ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
