// 初始化场景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("webgl"), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 添加灯光
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// 加载 3D 模型
const loader = new THREE.GLTFLoader();
let model;
loader.load("model.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});

// 交互控制
let isDragging = false;
let previousMouseX = 0;
document.addEventListener("mousedown", (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
});
document.addEventListener("mouseup", () => (isDragging = false));
document.addEventListener("mousemove", (event) => {
    if (isDragging && model) {
        let deltaX = event.clientX - previousMouseX;
        model.rotation.y += deltaX * 0.01;
        previousMouseX = event.clientX;
    }
});

// 渲染循环
camera.position.z = 5;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// WebXR AR 按钮
const arButton = document.getElementById("arButton");
arButton.addEventListener("click", async () => {
    if (navigator.xr) {
        try {
            const session = await navigator.xr.requestSession("immersive-ar");
            renderer.xr.enabled = true;
            renderer.xr.setSession(session);
        } catch (error) {
            console.error("AR 模式不可用", error);
        }
    } else {
        alert("你的设备不支持 AR 模式");
    }
});
