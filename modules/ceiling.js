import * as THREE from "three";

// 生成星空纹理（Canvas）
function makeStarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");

  // 深夜蓝黑底
  ctx.fillStyle = "#03040a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 星星
  for (let i = 0; i < 2500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 1.6 + 0.2;
    const alpha = Math.random() * 0.8 + 0.2;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }

  // 少量暖色星（更浪漫）
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 1.4 + 0.4;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,220,180,0.8)";
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;
  return texture;
}

export const createCeiling = (scene) => {
  // =========================
  // 1️⃣ 星空纹理
  // =========================
  const starTexture = makeStarTexture();

  // =========================
  // 2️⃣ 天花板几何
  // =========================
  const ceilingGeometry = new THREE.PlaneGeometry(45, 40);

  // 用自发光材质（星空一定要亮）
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: starTexture,
    emissiveMap: starTexture,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 1.2,
    roughness: 1.0,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);

  ceilingPlane.rotation.x = Math.PI / 2;
  ceilingPlane.position.y = 10; // 天花板高度（你可以微调 9~11）

  scene.add(ceilingPlane);
};
