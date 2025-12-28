import * as THREE from "three";

function makeStarTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d");

  const g = ctx.createRadialGradient(512, 512, 0, 512, 512, 700);
  g.addColorStop(0, "#050714");
  g.addColorStop(1, "#000005");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 1600; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() < 0.93 ? 1 : 2;
    const a = 0.22 + Math.random() * 0.78;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.6, 2.6); // 地面星密度（比墙稍密一点更好看）
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

// helper：画圆角矩形
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export const setupFloor = (scene) => {
  // ✅ 防止重复叠加：先删旧地板/贴纸
  const oldFloor = scene.getObjectByName("FLOOR");
  if (oldFloor) scene.remove(oldFloor);
  const oldSticker = scene.getObjectByName("FLOOR_STICKER");
  if (oldSticker) scene.remove(oldSticker);

  const FLOOR_Y = -3.99;

  // 1) 星空地板
  const floorGeo = new THREE.PlaneGeometry(45, 45);
  const starTex = makeStarTexture();

  const floorMat = new THREE.MeshStandardMaterial({
    map: starTex,
    roughness: 1.0,
    metalness: 0.0,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: starTex,
    emissiveIntensity: 0.10, // 地面更暗一点，护眼
  });

  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.name = "FLOOR";
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = FLOOR_Y;
  floor.receiveShadow = true;
  scene.add(floor);

  // 2) Happy New Year 贴纸（保持你原来的风格）
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0,0,0,0.30)";
  roundRect(ctx, 140, 220, canvas.width - 280, canvas.height - 440, 80);
  ctx.fill();

  ctx.fillStyle = "#F5F2EA";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 140px sans-serif";
  ctx.fillText("2026 Happy New Year", canvas.width / 2, canvas.height / 2 - 40);
  ctx.font = "120px sans-serif";
  ctx.fillText("🎉  ❤️  ✨", canvas.width / 2, canvas.height / 2 + 120);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.needsUpdate = true;

  const stickerGeo = new THREE.PlaneGeometry(16, 8);
  const stickerMat = new THREE.MeshStandardMaterial({
    map: tex,
    transparent: true,
    roughness: 0.95,
    metalness: 0.0,
  });

  const sticker = new THREE.Mesh(stickerGeo, stickerMat);
  sticker.name = "FLOOR_STICKER";
  sticker.rotation.x = -Math.PI / 2;
  sticker.position.y = FLOOR_Y + 0.01; // 贴地，防闪
  sticker.position.z = -6;
  sticker.position.x = 0;
  scene.add(sticker);
};
